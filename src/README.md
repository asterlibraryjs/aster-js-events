## EventEmitter

This implementation allow to isolate emitter.

### Declaration

```typescript
export class CounterService {
    private readonly _onDidChange = new EventEmitter<number>();
    private _counter: number;

    get onDidChange(): IEvent<number> { return this._onDidChange.event; }

    increment(): void {
        this._counter++;
        this._onDidChange.trigger(this._counter);
    }
}
```

### Usage

```typescript
class CounterListenerService {

    listen(counter: CounterService) {
        counter.onDidChange();
    }
}
```
