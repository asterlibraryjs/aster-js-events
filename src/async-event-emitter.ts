import { Memoize } from "@aster-js/decorators";
import { EventEmitterBase } from "./event-emitter-base";

import { IAsyncEvent, IEvent } from "./ievent";

export type AsyncEventHandler<T extends any[] = []> = (...args: T) => Promise<void | false>;

export class AsyncEventEmitter<T extends any[] = []> extends EventEmitterBase<AsyncEventHandler<T>> {

    @Memoize get event(): IAsyncEvent<T> { return IEvent.create(this); }

    async emit(...args: T): Promise<void> {
        for (const callback of this.handlers()) {
            if (await callback(...args) === false) break;
        }
    }
}
