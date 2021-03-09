import { Disposable } from "@aster-js/core";

const MAX_LISTENERS = 16;

export class EventEmitterBase<T extends (...args: any[]) => any> extends Disposable {
    private _handlers?: T[];
    private _maxSize?: number;

    get size(): number { return this._handlers ? this._handlers.length : 0; }

    get maxSize(): number { return this._maxSize ?? MAX_LISTENERS; }

    *handlers(): IterableIterator<T> {
        if (this._handlers) {
            yield* this._handlers;
        }
    }

    addHandler(handler: T): void {
        this.checkIfDisposed();

        if (this.size === this.maxSize) throw new Error("");

        if (this._handlers) {
            this._handlers.push(handler);
        }
        else {
            this._handlers = [handler];
        }
    }

    removeHandler(handler: T): void {
        if (this._handlers) {
            const idx = this._handlers.indexOf(handler);
            if (idx !== -1) this._handlers.splice(idx, 1);
        }
    }

    protected dispose(): void {
        delete this._handlers;
    }
}
