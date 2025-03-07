import { Call } from '../../client/methods/call';
import { List } from '../../client/methods/list';
import { Method, MethodParams } from '../../methods';
declare type Dependencies = {
    readonly call: Call;
    readonly list: List;
};
declare const _default: ({ call, list }: Dependencies) => {
    fields: () => Promise<import("../../payloads").GetPayload<import("../common").Fields>>;
    create: <D extends {
        readonly fields: Partial<import("./entities").Company>;
        readonly params?: {
            readonly REGISTER_SONET_EVENT: "Y" | "N";
        } | undefined;
    }>(fields: D["fields"], params?: D["params"] | undefined) => Promise<import("../../payloads").GetPayload<number>>;
    get: (id: string) => Promise<import("../../payloads").GetPayload<import("./entities").Company>>;
    list: (params?: MethodParams<Method.CRM_COMPANY_LIST>) => Promise<import("../../payloads").ListPayload<import("./entities").Company>>;
    update: <D_1 extends {
        readonly id: string;
        readonly fields: Record<string, unknown>;
        readonly params?: {
            readonly REGISTER_SONET_EVENT: "Y" | "N";
        } | undefined;
    }>(id: string, fields: D_1["fields"], params?: D_1["params"] | undefined) => Promise<import("../../payloads").GetPayload<boolean>>;
};
export default _default;
