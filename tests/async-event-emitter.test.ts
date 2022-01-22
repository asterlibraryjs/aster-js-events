import { assert } from "chai";
import { assert as sassert, spy, stub } from "sinon";
import { AsyncEventEmitter, AsyncEvent } from "../src";

describe("AsyncEventEmitter", () => {

    it("Should emit properly an async event", async () => {
        const spyEvent = spy();
        const emitter = new AsyncEventEmitter<[id: number, name: string]>();
        emitter.event(spyEvent);

        await emitter.emit(44, "Bob");

        sassert.calledOnce(spyEvent);
        sassert.calledWithExactly(spyEvent, 44, "Bob");
    });

    it("Should emit properly an async event with multiple listeners", async function () {
        this.timeout(2000);

        const emitter = new AsyncEventEmitter<[{ handled: boolean }]>();
        emitter.event((arg) => {
            return new Promise<void>(r => {
                setTimeout(() => {
                    arg.handled = true;
                    r();
                }, 1000);
            })
        });

        const arg = { handled: true };
        await emitter.emit(arg);

        assert.isTrue(arg.handled);
    });

    it("Should call twice the same func", async () => {
        const stubEvent = stub();
        const emitter = new AsyncEventEmitter();
        emitter.event(stubEvent);
        emitter.event(stubEvent);

        await emitter.emit();

        sassert.calledTwice(stubEvent);
    });

    it("Should call once the func after it returns false", async () => {
        const stubEvent = stub().returns(false);
        const emitter = new AsyncEventEmitter();
        emitter.event(stubEvent);
        emitter.event(stubEvent);

        await emitter.emit();

        sassert.calledOnce(stubEvent);
    });

    it("Should enable proper async iteration", async () => {
        const emitter = new AsyncEventEmitter<[string]>();

        async function doIteration(evt: AsyncEvent<[string]>) {
            const result: string[] = [];
            for await (const item of evt) {
                result.push(...item);
                if (result.length === 2) break;
            }
            return result;
        }
        const result = doIteration(emitter.event);

        assert.equal(emitter.size, 1);

        await emitter.emit("bob");
        await emitter.emit("jose");
        await emitter.emit("leon");

        assert.deepEqual(await result, ["bob", "jose"]);
        assert.equal(emitter.size, 0);
    });

    it("Should enable async iteration and not miss an iteration", async () => {
        const emitter = new AsyncEventEmitter<[string]>();

        async function doIteration(evt: AsyncEvent<[string]>) {
            const result: string[] = [];
            for await (const item of evt) {
                result.push(...item);
                if (result.length === 3) break;
                await new Promise<void>(r => setTimeout(() => r(), 100));
            }
            return result;
        }
        const result = doIteration(emitter.event);

        await emitter.emit("bob");
        await emitter.emit("jose");
        await emitter.emit("leon");

        assert.deepEqual(await result, ["bob", "jose", "leon"]);
    });

    it("Should enable async iteration and not miss an iteration when all events are spamed", async () => {
        const emitter = new AsyncEventEmitter<[string]>();

        async function doIteration(evt: AsyncEvent<[string]>) {
            const result: string[] = [];
            for await (const item of evt) {
                result.push(...item);
                if (result.length === 3) break;
                await new Promise<void>(r => setTimeout(() => r(), 100));
            }
            return result;
        }
        const result = doIteration(emitter.event);

        await Promise.all([
            emitter.emit("bob"),
            emitter.emit("jose"),
            emitter.emit("leon")
        ]);

        assert.deepEqual(await result, ["bob", "jose", "leon"]);
    });

});
