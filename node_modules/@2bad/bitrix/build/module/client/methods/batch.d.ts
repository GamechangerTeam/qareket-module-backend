import got from 'got';
import { Commands } from '../../commands';
import { Method, MethodPayloadType } from '../../methods';
import { BatchPayload } from '../../payloads';
export declare const MAX_COMMANDS_PER_BATCH = 50;
/**
 * Split any number of commands into the chunks with max commands per batch in each chunk
 */
export declare const chunkCommands: <C extends Commands>(commands: C, size?: number) => readonly C[];
/**
 * Prepares list of commands to be used in requests to the Bitrix
 * @note We could avoid that function... if only Bitrix API would support posting of the batch commands as
 *       plain objects, like it does with other methods. Instead, it should be a dict or array of string queries
 */
export declare const prepareCommandsQueries: <C extends Commands, R = { [K in keyof C]: string; }>(commands: C) => R;
/**
 * Merges list of batch responses into a single batch
 * @todo Generics inference is complicated here and might be not super accurate
 */
export declare const mergeBatchPayloads: <B extends BatchPayload<unknown>, P = B extends BatchPayload<infer U> ? U : never>(payloads: readonly B[]) => BatchPayload<P>;
export declare type CommandsPayloads<C extends Commands, CM = {
    [K in keyof C]: C[K] extends {
        readonly method: infer M;
    } ? M : never;
}> = {
    [K in keyof CM]: MethodPayloadType<CM[K] extends Method ? CM[K] : never>;
};
export declare type Batch = <C extends Commands, P = CommandsPayloads<C>>(commands: C, commandsPerRequest?: number) => Promise<BatchPayload<P>>;
declare type Dependencies = {
    readonly get: typeof got.get;
};
/**
 * Dispatches a batch request with specified commands. Will fill figure out payload type based on the Methods.
 * Supports unlimited number of commands. If they do exceed max amount of commands per batch, will dispatch
 * multiple request and merge result into single batch payload
 * @todo For now due to issues with types it won't check `params` of command, so any Method can be used
 *       with any (even wrong) params
 */
declare const _default: ({ get }: Dependencies) => Batch;
export default _default;
