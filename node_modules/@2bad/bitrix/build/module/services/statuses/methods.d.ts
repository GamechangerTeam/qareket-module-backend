import { Method } from '../../methods';
import { GetPayload, ListPayload } from '../../payloads';
import { Fields } from '../common';
import { Status } from './entities';
export declare type StatusesMethods = {
    readonly [Method.CRM_STATUS_FIELDS]: {
        readonly type: Status;
        readonly payload: GetPayload<Fields>;
        readonly params?: Record<string, unknown>;
    };
    readonly [Method.CRM_STATUS_ADD]: {
        readonly type: Status;
        readonly payload: GetPayload<number>;
        readonly params: {
            readonly fields: Partial<Status>;
        };
    };
    readonly [Method.CRM_STATUS_DELETE]: {
        readonly type: Status;
        readonly payload: GetPayload<boolean>;
        readonly params: {
            readonly id: string | number;
            readonly params?: {
                readonly FORCED?: 'Y' | 'N';
            };
        };
    };
    readonly [Method.CRM_STATUS_GET]: {
        readonly type: Status;
        readonly payload: GetPayload<Status>;
        readonly params: {
            readonly id: string | number;
        };
    };
    readonly [Method.CRM_STATUS_LIST]: {
        readonly type: Status;
        readonly payload: ListPayload<Status>;
        readonly params: {
            readonly order?: Record<string, unknown>;
            readonly filter?: Record<string, unknown>;
        };
    };
    readonly [Method.CRM_STATUS_UPDATE]: {
        readonly type: Status;
        readonly payload: GetPayload<boolean>;
        readonly params: {
            readonly id: string | number;
            readonly fields: Record<string, unknown>;
        };
    };
};
