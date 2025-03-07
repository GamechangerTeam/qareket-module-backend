"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const p_queue_1 = __importDefault(require("p-queue"));
const addAccessToken_1 = __importDefault(require("./hooks/addAccessToken"));
const batch_1 = __importDefault(require("./methods/batch"));
const call_1 = __importDefault(require("./methods/call"));
const list_1 = __importDefault(require("./methods/list"));
const BITRIX_API_RATE_LIMIT = 2;
const BITRIX_API_RATE_INTERVAL = 1000; // 1 second
/**
 * Construct a Bitrix client with generic methods
 * @param restURI REST endpoint, like a `https://hello.bitrix24.ru/rest` or an inbound webhook endpoint,
 *                like a `https://hello.bitrix24.ru/rest/1/WEBHOOK_TOKEN`.
 * @param accessToken Bitrix application Access Token. Do not specify in case inbound webhook endpoint used.
 * @param options an object that will overwrite underlying configuration for HTTP client,
 *                see `https://github.com/sindresorhus/got/blob/main/documentation/2-options.md`.
 */
exports.default = (restURI, accessToken, options) => {
    const client = got_1.default.extend({
        prefixUrl: restURI,
        headers: {
            'user-agent': '@2bad/bitrix'
        },
        responseType: 'json',
        hooks: {
            beforeRequest: [
                (0, addAccessToken_1.default)(accessToken)
            ]
        },
        ...options !== null && options !== void 0 ? options : {}
    });
    const queue = new p_queue_1.default({
        intervalCap: BITRIX_API_RATE_LIMIT,
        interval: BITRIX_API_RATE_INTERVAL
    });
    const queuedGet = (...args) => queue.add(() => client.get(...args));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error @todo remove after issue is resolved (https://github.com/sindresorhus/got/issues/954)
    const call = (0, call_1.default)({ get: queuedGet });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error @todo remove after issue is resolved (https://github.com/sindresorhus/got/issues/954)
    const batch = (0, batch_1.default)({ get: queuedGet });
    const list = (0, list_1.default)({ call, batch });
    return {
        call,
        batch,
        list
    };
};
