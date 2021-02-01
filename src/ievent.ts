import { Disposable, IDisposable } from "@aster-js/core";

import { EventArgs } from "./event-args";
import { IEventEmitter, EventHandler } from "./ievent-emitter";

export interface IEvent<T = any, R = void> {
    (handler: EventHandler<T, R>, thisArgs?: any): IDisposable;
}

export namespace IEvent {

    export function create<T = any, R = void>(emitter: IEventEmitter<T, R>): IEvent<T, R> {
        return (handler: (ev: EventArgs<T, R>) => void, thisArgs?: any) => {
            handler = thisArgs ? handler.bind(thisArgs) : handler;
            emitter.addHandler(handler);

            if (thisArgs instanceof Disposable) {
                thisArgs
            }
            return IDisposable.create(() => emitter.removeHandler(handler));
        };
    }

    export function next<T = any, R = void>(event: IEvent<T, R>): Promise<R | undefined> {
        return new Promise<R | undefined>((f) => {
            const handler = event(args => {
                IDisposable.safeDispose(handler);
                f(args.result);
            });
        });
    }

    export function once<T = any, R = void>(event: IEvent<T, R>, callback: (ev: EventArgs<T, R>) => void, thisArgs?: any): void {
        const handler = event(args => {
            IDisposable.safeDispose(handler);
            callback.call(thisArgs, args);
        });
    }
}