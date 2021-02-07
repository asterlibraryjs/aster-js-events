import { Disposable, IDisposable } from "@aster-js/core";

import { IEventEmitter, EventHandler } from "./ievent-emitter";

export interface IEvent<T extends any[] = []> {
    (handler: EventHandler<T>, thisArgs?: any): IDisposable;
}

export namespace IEvent {

    export function create<T extends any[] = []>(emitter: IEventEmitter<T>): IEvent<T> {
        return (handler: EventHandler<T>, thisArgs?: any) => {
            handler = thisArgs ? handler.bind(thisArgs) : handler;
            emitter.addHandler(handler);

            const result = IDisposable.create(() => emitter.removeHandler(handler));
            if (thisArgs instanceof Disposable) {
                thisArgs.registerForDispose(result);
            }
            return result;
        };
    }

    export function next<T extends any[] = []>(event: IEvent<T>): Promise<T> {
        return new Promise<T>((f) => {
            const handler = event((...args) => {
                IDisposable.safeDispose(handler);
                f(args);
            });
        });
    }

    export function once<T extends any[] = []>(event: IEvent<T>, callback: EventHandler<T>, thisArgs?: any): void {
        const handler = event((...args) => {
            IDisposable.safeDispose(handler);
            callback.call(thisArgs, ...args);
        });
    }
}