import { assert } from "chai";
import { assert as sassert, spy } from "sinon";
import { EventEmitter, IEvent } from "../src";

describe("EventEmitter", () => {

    it("Should emit properly an event", () => {
        const spyEvent = spy();
        const emitter = new EventEmitter<[id: number, name: string]>();
        emitter.event(spyEvent);

        emitter.emit(44, "Bob");

        sassert.calledOnce(spyEvent);
        sassert.calledWithExactly(spyEvent, 44, "Bob");
    });

    it("Should emit properly an event with multiple listeners", () => {
        const spyEvent1 = spy();
        const spyEvent2 = spy();
        const spyEvent3 = spy();
        const emitter = new EventEmitter();
        emitter.event(spyEvent1);
        emitter.event(spyEvent2);
        emitter.event(spyEvent3);

        emitter.emit();

        sassert.calledOnce(spyEvent1);
        sassert.calledOnce(spyEvent2);
        sassert.calledOnce(spyEvent3);
        sassert.callOrder(spyEvent1, spyEvent2, spyEvent3);
    });

    it("Should throw an error when too much handlers are pushed", () => {
        const emitter = new EventEmitter({ maxSize: 99 });
        assert.throw(
            () => Array(100).fill(null).forEach(() => emitter.addHandler(() => void 0)),
            "Event max size reached: 99"
        );
    });

    it("Should enable proper async iteration", async () => {
        const emitter = new EventEmitter<[string]>();

        async function doIteration(evt: IEvent<[string]>) {
            const result: string[] = [];
            for await (const item of evt) {
                result.push(...item);
                if (result.length === 2) break;
            }
            return result;
        }
        const result = doIteration(emitter.event);

        assert.equal(emitter.size, 1);

        emitter.emit("bob");
        emitter.emit("jose");
        emitter.emit("leon");

        assert.deepEqual(await result, ["bob", "jose"]);
        assert.equal(emitter.size, 0);
    });

    it("Should enable async iteration and not miss an iteration", async () => {
        const emitter = new EventEmitter<[string]>();

        async function doIteration(evt: IEvent<[string]>) {
            const result: string[] = [];
            for await (const item of evt) {
                result.push(...item);
                if (result.length === 3) break;
                await new Promise<void>(r => setTimeout(() => r(), 100))
            }
            return result;
        }
        const result = doIteration(emitter.event);

        emitter.emit("bob");
        emitter.emit("jose");
        emitter.emit("leon");

        assert.deepEqual(await result, ["bob", "jose", "leon"]);
    });

    it("Should throw an error when too much event are pushed", () => {
        const emitter = new EventEmitter({ iteratorQueueMaxSize: 99 });
        async function doIteration(evt: IEvent) {
            for await (const _ of evt) {
                await new Promise<void>(r => setTimeout(() => r(), 10000))
            }
        }
        doIteration(emitter.event);

        assert.throw(
            () => Array(105).fill(0).forEach(() => emitter.emit()),
            "Event iterator queue max size reached: 99 are pending"
        );
    });

});
