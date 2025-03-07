import { stringify as toQuery } from 'qs';
import isArray from '../../utils/isArray';
/**
 * Checks wether payload have any errors and if it does — throws them
 * Bitrix payload types do not provide discriminators, so we're forced to type cast them
 */
export const handlePayload = (payload) => {
    if (payload.error) {
        throw new Error(`[call] failed to get the resource: ${payload.error ?? ''}.`);
    }
    if (payload.result && payload.result.result_error) {
        const resultErrors = payload.result.result_error;
        const errors = isArray(resultErrors) ? resultErrors : Object.values(resultErrors);
        if (errors.length > 0) {
            // @todo We can give better formatting to display errored commands. But it's not important for now
            throw new Error(`[batch] failed to process. Received errors in ${errors.length} commands:\n${errors.join('\n')}`);
        }
    }
    return payload;
};
/**
 * Dispatches a request with specified method and params. Will fill figure out payload type based on the Method
 */
export default ({ get }) => {
    const call = (method, params) => get(method, { searchParams: toQuery(params) })
        .then(({ body }) => handlePayload(body));
    return call;
};
