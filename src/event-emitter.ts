import { Disposable } from "@aster-js/core";
import { Memoize } from "@aster-js/decorators";

import { EventArgs } from "./event-args";
import { IEvent } from "./ievent";
import { EventHandler, IEventEmitter } from "./ievent-emitter";

export class EventEmitter<T = void, R = void> extends Disposable implements IEventEmitter<T, R> {
    private _handlers?: EventHandler<T, R>[];

    get size(): number { return this._handlers ? this._handlers.length : 0; }

    @Memoize get event(): IEvent<T, R> { return IEvent.create(this); }

    trigger(detail: T): EventArgs<T, R> {
        const args = new EventArgs<T, R>(detail);

        for (const callback of this.handlers()) {
            callback(args);
            if (args.cancelled) break;
        }

        return args;
    }

    *handlers(): IterableIterator<EventHandler<T, R>> {
        if (this._handlers) {
            yield* this._handlers;
        }
    }

    addHandler(handler: EventHandler<T, R>): void {
        this.checkIfDisposed();

        if (this._handlers) {
            this._handlers.push(handler);
        }
        else {
            this._handlers = [handler];
        }
    }

    removeHandler(handler: EventHandler<T, R>): void {
        if (this._handlers) {
            const idx = this._handlers.indexOf(handler);
            if (idx !== -1) this._handlers.splice(idx, 1);
        }
    }

    protected dispose(): void {
        delete this._handlers;
    }
}
