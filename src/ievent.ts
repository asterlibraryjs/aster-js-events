import { Disposable, IDisposable } from "@aster-js/core";
import { AsyncEventEmitter, AsyncEventHandler } from "./async-event-emitter";
import { EventEmitter, EventHandler } from "./event-emitter";

export type IEvent<T extends any[] = []> = {
    readonly async: undefined;
    (handler: EventHandler<T>, thisArgs?: any): IDisposable;
}

export type IAsyncEvent<T extends any[] = []> = {
    readonly async: true;
    (handler: AsyncEventHandler<T>, thisArgs?: any): IDisposable;
}

export namespace IEvent {

    export function create<T extends any[] = []>(emitter: EventEmitter<T>): IEvent<T>;
    export function create<T extends any[] = []>(emitter: AsyncEventEmitter<T>): IAsyncEvent<T>;
    export function create<T extends any[] = []>(emitter: AsyncEventEmitter<T> | EventEmitter<T>): IEvent<T> | IAsyncEvent<T> {
        const event = (handler: (...args: any) => any, thisArgs?: any) => {
            handler = thisArgs ? handler.bind(thisArgs) : handler;
            emitter.addHandler(handler);

            const result = IDisposable.create(() => emitter.removeHandler(handler));
            if (thisArgs instanceof Disposable) {
                thisArgs.registerForDispose(result);
            }
            return result;
        };
        if (emitter instanceof AsyncEventEmitter) {
            Reflect.set(event, "async", true);
        }
        return event as IEvent<T> | IAsyncEvent<T>;
    }

    export function next<T extends any[] = []>(event: IEvent<T> | IAsyncEvent<T>): Promise<T> {
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

    export function once<T extends any[] = []>(event: IEvent<T> | IAsyncEvent<T>, callback: EventHandler<T>, thisArgs?: any): void {
        const handler = event.async
            ? event(async (...args) => {
                IDisposable.safeDispose(handler);
                await callback.call(thisArgs, ...args);
            })
            : event((...args) => {
                IDisposable.safeDispose(handler);
                callback.call(thisArgs, ...args);
            });
    }
}
