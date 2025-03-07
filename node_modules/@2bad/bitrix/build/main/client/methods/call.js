"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePayload = void 0;
const qs_1 = require("qs");
const isArray_1 = __importDefault(require("../../utils/isArray"));
/**
 * Checks wether payload have any errors and if it does — throws them
 * Bitrix payload types do not provide discriminators, so we're forced to type cast them
 */
const handlePayload = (payload) => {
    var _a;
    if (payload.error) {
        throw new Error(`[call] failed to get the resource: ${(_a = payload.error) !== null && _a !== void 0 ? _a : ''}.`);
    }
    if (payload.result && payload.result.result_error) {
        const resultErrors = payload.result.result_error;
        const errors = (0, isArray_1.default)(resultErrors) ? resultErrors : Object.values(resultErrors);
        if (errors.length > 0) {
            // @todo We can give better formatting to display errored commands. But it's not important for now
            throw new Error(`[batch] failed to process. Received errors in ${errors.length} commands:\n${errors.join('\n')}`);
        }
    }
    return payload;
};
exports.handlePayload = handlePayload;
/**
 * Dispatches a request with specified method and params. Will fill figure out payload type based on the Method
 */
exports.default = ({ get }) => {
    const call = (method, params) => get(method, { searchParams: (0, qs_1.stringify)(params) })
        .then(({ body }) => (0, exports.handlePayload)(body));
    return call;
};
