export declare type NumberString = string;
export declare type ISODate = string;
export declare type BoolString = 'Y' | 'N';
export declare type GenderString = 'M' | 'F' | '';
export declare type Fields = {
    readonly [key: string]: {
        readonly type: string;
        readonly isRequired: boolean;
        readonly isReadOnly: boolean;
        readonly isImmutable: boolean;
        readonly isMultiple: boolean;
        readonly isDynamic: boolean;
        readonly title: string;
    };
};
export declare type MultiField = {
    readonly ID: NumberString;
    readonly VALUE_TYPE: string;
    readonly VALUE: string;
    readonly TYPE_ID: string;
};
export declare type MultiFieldArray = ReadonlyArray<Pick<MultiField, 'VALUE' | 'VALUE_TYPE'>>;
