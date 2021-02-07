# @aster-js/events

Provides proper separation between the emitter and the event.

## Declaration

```ts
import { EventEmitter, IEvent } from "@aster-js/events";

class DataLoader<T> {
    private readonly _onDataLoaded = new EventEmitter<T>();

    get onDataLoaded(): IEvent<[T]> { return this._onDataLoaded.event; }

    fetchData(): Promise<void> {
        fetch("https://myapi.io/data")
            .then(r => r.json())
            .then(data => this._onDataLoaded.trigger(data));
    }
}
```

## Usage

```ts
type DataItem = { id: number, name: string };

const loader = new DataLoader<DataItem[]>();

loader.onDataLoaded((items: DataItem[])=> {
    // Do stuff
});
```
