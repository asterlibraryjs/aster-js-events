import { assert, spy } from "sinon";
import { EventEmitter } from "../src";

describe("Emitter", () => {

    it("Should emitte properly an event", async () => {
        const spyEvent = spy();
        const emitter = new EventEmitter<[id: number, name: string]>();
        emitter.event(spyEvent);

        emitter.emit(44, "Bob");

        assert.calledOnce(spyEvent);
        assert.calledWithExactly(spyEvent, 44, "Bob");
    });

    it("Should emitte properly an event with multiple listeners", async () => {
        const spyEvent1 = spy();
        const spyEvent2 = spy();
        const spyEvent3 = spy();
        const emitter = new EventEmitter();
        emitter.event(spyEvent1);
        emitter.event(spyEvent2);
        emitter.event(spyEvent3);

        emitter.emit();

        assert.calledOnce(spyEvent1);
        assert.calledOnce(spyEvent2);
        assert.calledOnce(spyEvent3);
        assert.callOrder(spyEvent1, spyEvent2, spyEvent3);
    });

});
