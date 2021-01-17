export type AsyncEventArgs<T = any, R = void> = EventArgs<T, Promise<R>>;

/**
 * Event argument for events triggered by an EmitterBase implementation.
 */
export class EventArgs<T = any, R = void>{
    private _result?: R;
    private _handled?: boolean;
    private _cancelled?: boolean;

    get result(): R | undefined { return this._result; }

    get handled(): boolean { return Boolean(this._handled); }

    get cancelled(): boolean { return Boolean(this._cancelled); }

    constructor(
        readonly detail: T
    ) { }

    handle(): boolean {
        if (this._handled) return false;

        this._handled = true;
        return true;
    }

    setResult(result: R, handled: boolean = true): boolean {
        if (this._handled) return false;

        this._result = result;
        this._handled = handled;
        return true;
    }

    cancel(): boolean {
        if (this._cancelled) return false;

        this._cancelled = true;
        delete this._result;

        return true;
    }
}
