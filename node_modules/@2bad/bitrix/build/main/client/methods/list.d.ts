import { Command } from '../../commands';
import { ListableMethod, MethodParams, MethodPayloadType } from '../../methods';
import { BatchPayload, ListPayload } from '../../payloads';
import { Batch } from './batch';
import { Call } from './call';
/**
 * Generates required amount of commands to process specified amount of entries
 */
export declare const fillWithCommands: <C extends Command>({ method, params }: C, start: number, toProcess: number, entriesPerCommand: number) => readonly {
    readonly method: C["method"];
    readonly params?: C["params"] | undefined;
}[];
/**
 * Get the highest value from object or an array if there's any
 */
export declare const highest: (input: ReadonlyArray<number | undefined> | Record<string, number | undefined>) => number | undefined;
/**
 * Converts batch payload to a list payload
 */
export declare const batchToListPayload: <P>(payload: BatchPayload<Record<string, P> | readonly P[]>) => ListPayload<P>;
declare type Dependencies = {
    readonly call: Call;
    readonly batch: Batch;
};
export declare type List = <M extends ListableMethod>(method: M, params: MethodParams<M>) => Promise<ListPayload<MethodPayloadType<M>>>;
/**
 * Gets all entries by dispatching required amount of requests. Will fill figure out payload type based on the Method.
 */
declare const _default: ({ call, batch }: Dependencies) => List;
export default _default;
