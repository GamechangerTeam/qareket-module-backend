"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchToListPayload = exports.highest = exports.fillWithCommands = void 0;
const lodash_range_1 = __importDefault(require("lodash.range"));
const MAX_ENTRIES_PER_COMMAND = 50;
/**
 * Generates required amount of commands to process specified amount of entries
 */
const fillWithCommands = ({ method, params }, start, toProcess, entriesPerCommand) => {
    const requiresCommands = Math.ceil((toProcess - start) / entriesPerCommand);
    return (0, lodash_range_1.default)(0, requiresCommands)
        .map((i) => ({ method, params: { ...params, start: start + (entriesPerCommand * i) } }));
};
exports.fillWithCommands = fillWithCommands;
/**
 * Get the highest value from object or an array if there's any
 */
const highest = (input) => Object.values(input).reduce((a, b) => a !== undefined && b !== undefined
    ? a > b ? a : b
    : a !== undefined && b === undefined
        ? a
        : a === undefined && b !== undefined
            ? b
            : undefined, undefined);
exports.highest = highest;
/**
 * Converts batch payload to a list payload
 */
const batchToListPayload = (payload) => {
    var _a;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { result: { result, result_total, result_error, result_next }, time } = payload;
    const flattenResult = Object.entries(result).reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // @ts-expect-error ignore this for now
    (flatten, [_key, r]) => !r ? flatten : [...flatten, ...r], []);
    return {
        error: Object.values(result_error).join('\n'),
        next: (0, exports.highest)(result_next),
        result: flattenResult,
        // @todo Not accurate, we do not care
        time,
        total: (_a = (0, exports.highest)(result_total)) !== null && _a !== void 0 ? _a : 0
    };
};
exports.batchToListPayload = batchToListPayload;
/**
 * Gets all entries by dispatching required amount of requests. Will fill figure out payload type based on the Method.
 */
exports.default = ({ call, batch }) => {
    const list = async (method, params) => {
        var _a;
        const start = (_a = params.start) !== null && _a !== void 0 ? _a : 0;
        const listAll = async () => {
            const batchCommands = (0, exports.fillWithCommands)({ method, params }, start, firstCall.total, MAX_ENTRIES_PER_COMMAND);
            const payload = await batch(batchCommands);
            return (0, exports.batchToListPayload)(payload);
        };
        const firstCall = await call(method, { ...params, start });
        return !firstCall.next ? firstCall : await listAll();
    };
    return list;
};
