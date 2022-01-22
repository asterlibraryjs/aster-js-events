import { Memoize } from "@aster-js/decorators";
import { EventEmitterBase } from "./event-emitter-base";

import { IEvent } from "./ievent";
import { AsyncEventHandler, IAsyncEventEmitter } from "./ievent-emitter";

export class AsyncEventEmitter<T extends any[] = []> extends EventEmitterBase<AsyncEventHandler<T>> implements IAsyncEventEmitter<T> {

    get async(): true { return true; }

    @Memoize get event(): IEvent<T, true> { return IEvent.create(this); }

    async emit(...args: T): Promise<void> {
        for (const callback of this.handlers()) {
            if (await callback(...args) === false) break;
        }
    }
}
