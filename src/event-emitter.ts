import { Disposable } from "@aster-js/core";
import { Memoize } from "@aster-js/decorators";

import { IEvent } from "./ievent";
import { EventHandler, IEventEmitter } from "./ievent-emitter";

export class EventEmitter<T extends any[] = []> extends Disposable implements IEventEmitter<T> {
    private _handlers?: EventHandler<T>[];

    get size(): number { return this._handlers ? this._handlers.length : 0; }

    @Memoize get event(): IEvent<T> { return IEvent.create(this); }

    emit(...args: T): void {
        for (const callback of this.handlers()) {
            callback(...args);
        }
    }

    *handlers(): IterableIterator<EventHandler<T>> {
        if (this._handlers) {
            yield* this._handlers;
        }
    }

    addHandler(handler: EventHandler<T>): void {
        this.checkIfDisposed();

        if (this._handlers) {
            this._handlers.push(handler);
        }
        else {
            this._handlers = [handler];
        }
    }

    removeHandler(handler: EventHandler<T>): void {
        if (this._handlers) {
            const idx = this._handlers.indexOf(handler);
            if (idx !== -1) this._handlers.splice(idx, 1);
        }
    }

    protected dispose(): void {
        delete this._handlers;
    }
}
