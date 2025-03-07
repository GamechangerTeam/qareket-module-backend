import range from 'lodash.range';
const MAX_ENTRIES_PER_COMMAND = 50;
/**
 * Generates required amount of commands to process specified amount of entries
 */
export const fillWithCommands = ({ method, params }, start, toProcess, entriesPerCommand) => {
    const requiresCommands = Math.ceil((toProcess - start) / entriesPerCommand);
    return range(0, requiresCommands)
        .map((i) => ({ method, params: { ...params, start: start + (entriesPerCommand * i) } }));
};
/**
 * Get the highest value from object or an array if there's any
 */
export const highest = (input) => Object.values(input).reduce((a, b) => a !== undefined && b !== undefined
    ? a > b ? a : b
    : a !== undefined && b === undefined
        ? a
        : a === undefined && b !== undefined
            ? b
            : undefined, undefined);
/**
 * Converts batch payload to a list payload
 */
export const batchToListPayload = (payload) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { result: { result, result_total, result_error, result_next }, time } = payload;
    const flattenResult = Object.entries(result).reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // @ts-expect-error ignore this for now
    (flatten, [_key, r]) => !r ? flatten : [...flatten, ...r], []);
    return {
        error: Object.values(result_error).join('\n'),
        next: highest(result_next),
        result: flattenResult,
        // @todo Not accurate, we do not care
        time,
        total: highest(result_total) ?? 0
    };
};
/**
 * Gets all entries by dispatching required amount of requests. Will fill figure out payload type based on the Method.
 */
export default ({ call, batch }) => {
    const list = async (method, params) => {
        const start = params.start ?? 0;
        const listAll = async () => {
            const batchCommands = fillWithCommands({ method, params }, start, firstCall.total, MAX_ENTRIES_PER_COMMAND);
            const payload = await batch(batchCommands);
            return batchToListPayload(payload);
        };
        const firstCall = await call(method, { ...params, start });
        return !firstCall.next ? firstCall : await listAll();
    };
    return list;
};
