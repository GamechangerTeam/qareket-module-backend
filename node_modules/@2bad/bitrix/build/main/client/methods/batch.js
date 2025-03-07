"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeBatchPayloads = exports.prepareCommandsQueries = exports.chunkCommands = exports.MAX_COMMANDS_PER_BATCH = void 0;
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const lodash_frompairs_1 = __importDefault(require("lodash.frompairs"));
const qs_1 = require("qs");
const methods_1 = require("../../methods");
const isArray_1 = __importDefault(require("../../utils/isArray"));
const call_1 = require("./call");
exports.MAX_COMMANDS_PER_BATCH = 50;
/**
 * Split any number of commands into the chunks with max commands per batch in each chunk
 */
const chunkCommands = (commands, size = exports.MAX_COMMANDS_PER_BATCH) => {
    const commandsIsArray = (0, isArray_1.default)(commands);
    const chunks = (0, lodash_chunk_1.default)(Object.entries(commands), size);
    // @todo Generated return type isn't very accurate since it says that it will make array of <C>, while
    //       in fact <C> will be distributed among chunks. That gives wrong hints with named commands and arrays as const.
    return chunks.map((c) => commandsIsArray
        // @todo Figure out how to avoid unsafe casting to <C> here
        //       Without `<C>` generic it won't work with complex functions like `batch`
        ? c.map(([_key, command]) => command)
        : (0, lodash_frompairs_1.default)(c));
};
exports.chunkCommands = chunkCommands;
/**
 * Prepares list of commands to be used in requests to the Bitrix
 * @note We could avoid that function... if only Bitrix API would support posting of the batch commands as
 *       plain objects, like it does with other methods. Instead, it should be a dict or array of string queries
 */
const prepareCommandsQueries = (commands) => Object.entries(commands).reduce((calls, [name, { method, params }]) => {
    const stringifiedParams = params ? `?${(0, qs_1.stringify)(params)}` : '';
    return {
        ...calls,
        [`cmd[${name}]`]: `${method}${stringifiedParams}`
    };
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
}, {});
exports.prepareCommandsQueries = prepareCommandsQueries;
/**
 * Merges list of batch responses into a single batch
 * @todo Generics inference is complicated here and might be not super accurate
 */
const mergeBatchPayloads = (payloads) => {
    const merge = (a, b) => (0, isArray_1.default)(a) && (0, isArray_1.default)(b)
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
exports.mergeBatchPayloads = mergeBatchPayloads;
/**
 * Dispatches a batch request with specified commands. Will fill figure out payload type based on the Methods.
 * Supports unlimited number of commands. If they do exceed max amount of commands per batch, will dispatch
 * multiple request and merge result into single batch payload
 * @todo For now due to issues with types it won't check `params` of command, so any Method can be used
 *       with any (even wrong) params
 */
exports.default = ({ get }) => {
    const batch = async (commands, commandsPerRequest = exports.MAX_COMMANDS_PER_BATCH) => {
        const call = (c) => get(methods_1.Method.BATCH, { searchParams: (0, exports.prepareCommandsQueries)(c) })
            .then(({ body }) => body);
        const calls = (0, exports.chunkCommands)(commands, commandsPerRequest)
            .map(call);
        return await Promise.all(calls)
            .then((chunkedPayloads) => {
            const payloads = (0, exports.mergeBatchPayloads)(chunkedPayloads);
            return (0, call_1.handlePayload)(payloads);
        });
    };
    return batch;
};
