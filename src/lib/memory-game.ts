import { assign, setup } from "xstate";

export const SECRET_WORD = "play";
export const PAIR_COUNT = 6;

export function shuffledDeck() {
  const deck = Array.from({ length: PAIR_COUNT * 2 }, (_, index) => index % PAIR_COUNT);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const left = deck[i];
    const right = deck[j];
    if (left !== undefined && right !== undefined) {
      deck[i] = right;
      deck[j] = left;
    }
  }
  return deck;
}

export function secretBuffer(buffer: string, key: string) {
  return key.length === 1 ? (buffer + key.toLowerCase()).slice(-SECRET_WORD.length) : "";
}

export const memoryMachine = setup({
  types: {
    context: {} as { deck: number[]; selected: number[]; matched: number[]; moves: number },
    input: {} as { deck: number[] },
    events: {} as { type: "FLIP"; index: number } | { type: "RESET"; deck: number[] },
  },
  guards: {
    playable: ({ context, event }) => event.type === "FLIP" && Number.isInteger(event.index)
      && event.index >= 0 && event.index < context.deck.length
      && !context.selected.includes(event.index) && !context.matched.includes(event.index),
    pair: ({ context }) => {
      const [first, second] = context.selected;
      return first !== undefined && second !== undefined && context.deck[first] === context.deck[second];
    },
    complete: ({ context }) => context.matched.length === PAIR_COUNT * 2,
  },
  actions: {
    select: assign({ selected: ({ context, event }) => event.type === "FLIP" ? [...context.selected, event.index] : context.selected }),
    move: assign({ moves: ({ context }) => context.moves + 1 }),
    match: assign({ matched: ({ context }) => [...context.matched, ...context.selected], selected: [] }),
    clear: assign({ selected: [] }),
    reset: assign(({ event }) => ({ deck: event.type === "RESET" ? event.deck : [], selected: [], matched: [], moves: 0 })),
  },
}).createMachine({
  id: "memory",
  context: ({ input }) => ({ deck: input.deck, selected: [], matched: [], moves: 0 }),
  initial: "ready",
  on: { RESET: { target: ".ready", actions: "reset" } },
  states: {
    ready: { on: { FLIP: { guard: "playable", target: "one", actions: "select" } } },
    one: { on: { FLIP: { guard: "playable", target: "checking", actions: ["select", "move"] } } },
    checking: { always: [{ guard: "pair", target: "matched", actions: "match" }, { target: "waiting" }] },
    matched: { always: [{ guard: "complete", target: "won" }, { target: "ready" }] },
    waiting: { after: { 850: { target: "ready", actions: "clear" } } },
    won: {},
  },
});