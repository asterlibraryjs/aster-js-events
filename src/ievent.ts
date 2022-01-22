import { Disposable, IDisposable } from "@aster-js/core";
import { AsyncEventIterator } from "./async-event-iterator";
import { AsyncEventHandler, EventHandler, IAsyncEventEmitter, IEventEmitter } from "./ievent-emitter";

export type SyncEvent<T extends any[] = []> = AsyncIterable<T> & {
    readonly async: undefined;
    (handler: EventHandler<T>, thisArgs?: any): IDisposable;
}

/**
 * Async event allow
 */
export type AsyncEvent<T extends any[] = []> = AsyncIterable<T> & {
    readonly async: true;
    (handler: AsyncEventHandler<T>, thisArgs?: any): IDisposable;
}

export type IEvent<T extends any[] = [], Async extends boolean = false> = Async extends true ? AsyncEvent<T> : SyncEvent<T>;

export namespace IEvent {

    export function create<T extends any[] = []>(emitter: IEventEmitter<T>): SyncEvent<T>;
    export function create<T extends any[] = []>(emitter: IAsyncEventEmitter<T>): AsyncEvent<T>;
    export function create<T extends any[] = []>(emitter: IAsyncEventEmitter<T> | IEventEmitter<T>): IEvent<T, boolean> {
        const event = ((handler: (...args: any) => any, thisArgs?: any) => {
            handler = thisArgs ? handler.bind(thisArgs) : handler;
            emitter.addHandler(handler);

            const result = IDisposable.create(() => emitter.removeHandler(handler));
            if (thisArgs instanceof Disposable) {
                thisArgs.registerForDispose(result);
            }
            return result;
        }) as IEvent<T, boolean>;

        Reflect.set(event, Symbol.asyncIterator, () => new AsyncEventIterator(event, emitter.iteratorQueueMaxSize));

        if (emitter.async) Reflect.set(event, "async", true);

        return event;
    }

    /**
     * Returns the next event arguments passed to the provided event
     * @param event Event to listen
     * @returns Arguments passed to the emitter
     */
    export function next<T extends any[] = []>(event: IEvent<T, boolean>): Promise<T> {
        return new Promise<T>((f) => {
            const handler = event.async
                ? event(async (...args) => {
                    IDisposable.safeDispose(handler);
                    f(args);
                })
                : event((...args) => {
                    IDisposable.safeDispose(handler);
                    f(args);
                });
        });
    }

    /**
     * Listen and trigger the provided callback once and remove imediatly the listener to avoir further calls
     * @param event Event to listen
     * @param callback Callback to call once
     * @param thisArgs This context
     */
    export function once<T extends any[] = []>(event: IEvent<T, boolean>, callback: EventHandler<T> | AsyncEventHandler<T>, thisArgs?: any): void {
        const handler = event.async
            ? event(async (...args) => {
                IDisposable.safeDispose(handler);
                await (callback as AsyncEventHandler<T>).call(thisArgs, ...args);
            })
            : event((...args) => {
                IDisposable.safeDispose(handler);
                (callback as EventHandler<T>).call(thisArgs, ...args);
            });
    }
}
