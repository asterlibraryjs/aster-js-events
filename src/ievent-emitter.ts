import { IDisposable } from "@aster-js/core";

import { EventArgs } from "./event-args";
import { IEvent } from "./ievent";

export type EventHandler<T = any, R = void> = (ev: EventArgs<T, R>) => void;

export interface IEventEmitter<T = any, R = void> extends IDisposable {

    readonly size: number;

    readonly event: IEvent<T, R>;

    trigger(detail: T): EventArgs<T, R>;

    handlers(): IterableIterator<EventHandler<T, R>>;

    addHandler(handler: EventHandler<T, R>): void;

    removeHandler(handler: EventHandler<T, R>): void;
}