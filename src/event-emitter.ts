import { Memoize } from "@aster-js/decorators";
import { EventEmitterBase } from "./event-emitter-base";

import { IEvent } from "./ievent";
import { EventHandler, IEventEmitter } from "./ievent-emitter";

export class EventEmitter<T extends any[] = []> extends EventEmitterBase<EventHandler<T>> implements IEventEmitter<T> {

    readonly async: undefined;

    @Memoize get event(): IEvent<T> { return IEvent.create(this); }

    emit(...args: T): void {
        for (const callback of this.handlers()) {
            if (callback(...args) === false) break;
        }
    }
}
