import chunk from 'lodash.chunk';
import fromPairs from 'lodash.frompairs';
import { stringify as toQuery } from 'qs';
import { Method } from '../../methods';
import isArray from '../../utils/isArray';
import { handlePayload } from './call';
export const MAX_COMMANDS_PER_BATCH = 50;
/**
 * Split any number of commands into the chunks with max commands per batch in each chunk
 */
export const chunkCommands = (commands, size = MAX_COMMANDS_PER_BATCH) => {
    const commandsIsArray = isArray(commands);
    const chunks = chunk(Object.entries(commands), size);
    // @todo Generated return type isn't very accurate since it says that it will make array of <C>, while
    //       in fact <C> will be distributed among chunks. That gives wrong hints with named commands and arrays as const.
    return chunks.map((c) => commandsIsArray
        // @todo Figure out how to avoid unsafe casting to <C> here
        //       Without `<C>` generic it won't work with complex functions like `batch`
        ? c.map(([_key, command]) => command)
        : fromPairs(c));
};
/**
 * Prepares list of commands to be used in requests to the Bitrix
 * @note We could avoid that function... if only Bitrix API would support posting of the batch commands as
 *       plain objects, like it does with other methods. Instead, it should be a dict or array of string queries
 */
export const prepareCommandsQueries = (commands) => Object.entries(commands).reduce((calls, [name, { method, params }]) => {
    const stringifiedParams = params ? `?${toQuery(params)}` : '';
    return {
        ...calls,
        [`cmd[${name}]`]: `${method}${stringifiedParams}`
    };
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
}, {});
/**
 * Merges list of batch responses into a single batch
 * @todo Generics inference is complicated here and might be not super accurate
 */
export const mergeBatchPayloads = (payloads) => {
    const merge = (a, b) => isArray(a) && isArray(b)
        // @todo Gotta find way to avoid unsafe casting here
        ? [...a, ...b]
        : ({ ...a, ...b });
    return payloads.reduce((merged, payload) => ({
        result: {
            result: merge(merged.result.result || [], payload.result.result),
            result_error: merge(merged.result.result_error || [], payload.result.result_error),
            result_next: merge(merged.result.result_next || [], payload.result.result_next),
            result_time: merge(merged.result.result_time || [], payload.result.result_time),
            result_total: merge(merged.result.result_total || [], payload.result.result_total)
        },
        time: { ...merged.time, ...payload.time }
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }), { result: {}, time: {} });
};
/**
 * Dispatches a batch request with specified commands. Will fill figure out payload type based on the Methods.
 * Supports unlimited number of commands. If they do exceed max amount of commands per batch, will dispatch
 * multiple request and merge result into single batch payload
 * @todo For now due to issues with types it won't check `params` of command, so any Method can be used
 *       with any (even wrong) params
 */
export default ({ get }) => {
    const batch = async (commands, commandsPerRequest = MAX_COMMANDS_PER_BATCH) => {
        const call = (c) => get(Method.BATCH, { searchParams: prepareCommandsQueries(c) })
            .then(({ body }) => body);
        const calls = chunkCommands(commands, commandsPerRequest)
            .map(call);
        return await Promise.all(calls)
            .then((chunkedPayloads) => {
            const payloads = mergeBatchPayloads(chunkedPayloads);
            return handlePayload(payloads);
        });
    };
    return batch;
};
