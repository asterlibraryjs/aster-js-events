import { DisposableHost } from "@aster-js/core";

const MAX_LISTENERS = 16;
const DISABLED_MAX = -1;

export class EventEmitterBase<T extends (...args: any[]) => any> extends DisposableHost {
    private _handlers?: T[];
    private readonly _maxSize?: number;
    private readonly _iteratorQueueMaxSize?: number;

    get size(): number { return this._handlers ? this._handlers.length : 0; }

    get maxSize(): number { return this._maxSize ?? MAX_LISTENERS; }

    get iteratorQueueMaxSize(): number { return this._iteratorQueueMaxSize ?? DISABLED_MAX; }

    constructor(options?: { maxSize?: number, iteratorQueueMaxSize?: number }) {
        super();
        if (options) {
            if (typeof options.maxSize === "number") {
                this._maxSize = options.maxSize;
            }
            if (typeof options.iteratorQueueMaxSize === "number") {
                this._iteratorQueueMaxSize = options.iteratorQueueMaxSize;
            }
        }
    }

    *handlers(): IterableIterator<T> {
        if (this._handlers) {
            yield* this._handlers;
        }
    }

    addHandler(handler: T): void {
        this.checkIfDisposed();
        if (this.maxSize !== DISABLED_MAX && this.size >= this.maxSize) {
            throw new Error(`Event max size reached: ${this.maxSize}`);
        }

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
