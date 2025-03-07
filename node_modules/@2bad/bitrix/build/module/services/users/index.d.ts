import { Call } from '../../client/methods/call';
declare type Dependencies = {
    readonly call: Call;
};
declare const _default: ({ call }: Dependencies) => {
    fields: () => Promise<import("../../payloads").GetPayload<import("./entities").User>>;
    get: (id?: string) => Promise<import("../../payloads").GetPayload<readonly import("./entities").User[]>>;
};
export default _default;
