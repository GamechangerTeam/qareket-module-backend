import { Call } from '../../client/methods/call';
import { Method, MethodParams } from '../../methods';
declare type Dependencies = {
    readonly call: Call;
};
declare const _default: ({ call }: Dependencies) => {
    fields: () => Promise<import("../../payloads").GetPayload<import("../common").Fields>>;
    create: (fields: MethodParams<Method.CRM_STATUS_ADD>['fields']) => Promise<import("../../payloads").GetPayload<number>>;
    delete: (id: string | number, params?: MethodParams<Method.CRM_STATUS_DELETE>['params']) => Promise<import("../../payloads").GetPayload<boolean>>;
    get: (id: string | number) => Promise<import("../../payloads").GetPayload<import("./entities").Status>>;
    list: (params?: MethodParams<Method.CRM_STATUS_LIST>) => Promise<import("../../payloads").ListPayload<import("./entities").Status>>;
    update: (id: string | number, fields: MethodParams<Method.CRM_STATUS_UPDATE>['fields']) => Promise<import("../../payloads").GetPayload<boolean>>;
};
export default _default;
