import { BeforeRequestHook } from 'got';
/**
 * Got can't merge `query` option with other queries if they are string. But that hook can.
 */
declare const _default: (accessToken?: string) => BeforeRequestHook;
export default _default;
