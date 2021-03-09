import { Memoize } from "@aster-js/decorators";
import { EventEmitterBase } from "./event-emitter-base";

import { IEvent } from "./ievent";

export type EventHandler<T extends any[] = []> = (...args: T) => void | false;

export class EventEmitter<T extends any[] = []> extends EventEmitterBase<EventHandler<T>> {

    @Memoize get event(): IEvent<T> { return IEvent.create(this); }

    emit(...args: T): void {
        for (const callback of this.handlers()) {
            if (callback(...args) === false) break;
        }
    }
}
