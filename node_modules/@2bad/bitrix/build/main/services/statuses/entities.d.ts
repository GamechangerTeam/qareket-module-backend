import { BoolString, NumberString } from '../common';
export declare type Extra = {
    readonly SEMANTICS: string;
    readonly COLOR: string;
};
export declare type Status = {
    readonly [key: string]: string | Extra | undefined;
    readonly ID: NumberString;
    readonly ENTITY_ID: string;
    readonly STATUS_ID: NumberString;
    readonly NAME: string;
    readonly NAME_INIT: string;
    readonly SORT: NumberString;
    readonly SYSTEM: BoolString;
    readonly EXTRA: Extra | undefined;
};
