import { IDisposable } from "@aster-js/core";

import { IEvent } from "./ievent";

export type EventHandler<T extends any[] = []> = (...args: T) => void;

export interface IEventEmitter<T extends any[] = []> extends IDisposable {

    readonly size: number;

    readonly event: IEvent<T>;

    emit(...args: T): void;

    handlers(): IterableIterator<EventHandler<T>>;

    addHandler(handler: EventHandler<T>): void;

    removeHandler(handler: EventHandler<T>): void;
}