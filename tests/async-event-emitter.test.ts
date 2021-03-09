import { assert } from "chai";
import { assert as sassert, spy, stub } from "sinon";
import { AsyncEventEmitter } from "../src";

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

});
