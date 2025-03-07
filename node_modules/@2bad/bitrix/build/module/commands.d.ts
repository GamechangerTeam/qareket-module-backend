import { Method } from './methods';
export declare type Command = {
    readonly method: Method;
    readonly params?: Record<string, any>;
};
export declare type Commands = {
    readonly [key: string]: Command;
} | {
    readonly [index: number]: Command;
};
