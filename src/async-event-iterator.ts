import { IDisposable } from "@aster-js/core";
import { IEvent } from "./ievent";

type Next<T> = (args: T) => void;

export class AsyncEventIterator<T extends any[] = []> implements AsyncIterator<T>, IDisposable {
    private readonly _queueMaxSize: number;
    private _handle: IDisposable | null;
    private _next: Next<T> | null;
    private _pendingQueue: T[] | null;

    constructor(target: IEvent<T, boolean>, queueMaxSize: number) {
        this._handle = target(this.onDidEventEmitted as any, this);
        this._queueMaxSize = queueMaxSize;
        this._next = null;
        this._pendingQueue = [];
    }

    protected onDidEventEmitted(...args: T): void {
        const next = this._next;
        if (next) {
            this._next = null;
            next(args);
        }
        else if (this._pendingQueue) {
            if (this._queueMaxSize !== -1 && this._pendingQueue.length >= this._queueMaxSize) {
                throw new Error(`Event iterator queue max size reached: ${this._queueMaxSize} are pending`);
            }
            this._pendingQueue.push(args);
        }
    }

    next(): Promise<IteratorResult<T>> {
        if (!this._pendingQueue) throw new Error("Cannot reuse a terminated iterator");

        if (this._pendingQueue.length) {
            return Promise.resolve({
                value: this._pendingQueue.shift()!,
                done: false
            });
        }

        return new Promise(resolve => {
            this._next = (args) => {
                resolve({
                    value: args,
                    done: false
                });
            }
        });
    }

    async return(): Promise<IteratorResult<T>> {
        this.dispose();
        return {
            value: null,
            done: true
        };
    }

    [IDisposable.dispose](): void {
        if (this._handle) {
            this.dispose();
        }
    }

    protected dispose(): void {
        IDisposable.safeDispose(this._handle);
        this._handle = null;
        this._pendingQueue = null;
    }
}
