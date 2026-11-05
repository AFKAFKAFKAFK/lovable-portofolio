import { createActor } from "xstate";
import { afterEach, describe, expect, it, vi } from "vitest";
import { memoryMachine, shuffledDeck, secretBuffer, SECRET_WORD } from "@/lib/memory-game";

const deck = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
afterEach(() => vi.useRealTimers());
describe("Hidden memory game", () => {
  it("only detects the complete secret word", () => {
    let buffer = "";
    for (const key of "pla") buffer = secretBuffer(buffer, key);
    expect(buffer).not.toBe(SECRET_WORD);
    expect(secretBuffer(buffer, "Y")).toBe("play");
  });
  it("deals six pairs", () => {
    expect(shuffledDeck().sort()).toEqual([...deck].sort());
  });
  it("locks a mismatched pair then turns it back over", () => {
    vi.useFakeTimers();
    const actor = createActor(memoryMachine, { input: { deck } }).start();
    actor.send({ type: "FLIP", index: 0 });
    actor.send({ type: "FLIP", index: 0 });
    expect(actor.getSnapshot().context.moves).toBe(0);
    actor.send({ type: "FLIP", index: 2 });
    actor.send({ type: "FLIP", index: 4 });
    expect(actor.getSnapshot().context.selected).toEqual([0, 2]);
    vi.advanceTimersByTime(850);
    expect(actor.getSnapshot().context.selected).toEqual([]);
    expect(actor.getSnapshot().context.moves).toBe(1);
    actor.stop();
  });
  it("wins after all six pairs and resets cleanly", () => {
    const actor = createActor(memoryMachine, { input: { deck } }).start();
    for (let index = 0; index < 12; index++) actor.send({ type: "FLIP", index });
    expect(actor.getSnapshot().value).toBe("won");
    expect(actor.getSnapshot().context.moves).toBe(6);
    actor.send({ type: "RESET", deck });
    expect(actor.getSnapshot().value).toBe("ready");
    expect(actor.getSnapshot().context.matched).toEqual([]);
    expect(actor.getSnapshot().context.moves).toBe(0);
    actor.stop();
  });
});