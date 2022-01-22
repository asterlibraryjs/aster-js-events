import { IEvent } from "./ievent";

export type EventHandler<T extends any[] = []> = (...args: T) => void | false;

export type AsyncEventHandler<T extends any[] = []> = (...args: T) => Promise<void | false>;

interface IEventEmitterBase<T extends (...args: any[]) => any> {

    readonly size: number;

    readonly maxSize: number;

    readonly iteratorQueueMaxSize: number;

    handlers(): IterableIterator<T>;

    addHandler(handler: T): void;

    removeHandler(handler: T): void;
}

export interface IEventEmitter<T extends any[] = []> extends IEventEmitterBase<EventHandler<T>> {

    readonly async: undefined;

    readonly event: IEvent<T>;

    emit(...args: T): void;
}

export interface IAsyncEventEmitter<T extends any[] = []> extends IEventEmitterBase<AsyncEventHandler<T>> {

    readonly async: true;

    readonly event: IEvent<T, true>;

    emit(...args: T): Promise<void> ;
}
