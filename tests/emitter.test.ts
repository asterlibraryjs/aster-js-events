import { assert, spy } from "sinon";
import { EventEmitter } from "../src";

describe("Emitter", () => {

    it("Should emitte properly an event", async () => {
        const spyEvent = spy();
        const emitter = new EventEmitter();
        emitter.event(spyEvent);

        emitter.trigger();

        assert.calledOnce(spyEvent);
    });

    it("Should emitte properly an event with multiple listeners", async () => {
        const spyEvent1 = spy();
        const spyEvent2 = spy();
        const spyEvent3 = spy();
        const emitter = new EventEmitter();
        emitter.event(spyEvent1);
        emitter.event(spyEvent2);
        emitter.event(spyEvent3);

        emitter.trigger();

        assert.calledOnce(spyEvent1);
        assert.calledOnce(spyEvent2);
        assert.calledOnce(spyEvent3);
        assert.callOrder(spyEvent1, spyEvent2, spyEvent3);
    });

});
