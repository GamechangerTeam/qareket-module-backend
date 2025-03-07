import { ExtendOptions } from 'got';
/**
 * Construct a Bitrix client with generic methods
 * @param restURI REST endpoint, like a `https://hello.bitrix24.ru/rest` or an inbound webhook endpoint,
 *                like a `https://hello.bitrix24.ru/rest/1/WEBHOOK_TOKEN`.
 * @param accessToken Bitrix application Access Token. Do not specify in case inbound webhook endpoint used.
 * @param options an object that will overwrite underlying configuration for HTTP client,
 *                see `https://github.com/sindresorhus/got/blob/main/documentation/2-options.md`.
 */
declare const _default: (restURI: string, accessToken?: string, options?: ExtendOptions) => {
    call: import("./methods/call").Call;
    batch: import("./methods/batch").Batch;
    list: import("./methods/list").List;
};
export default _default;
