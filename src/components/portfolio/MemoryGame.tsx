import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Apple, Aperture, Flower2, Gem, Moon, Sparkles, RotateCcw, X, Check, Trophy } from "lucide-react";
import { useActor } from "@xstate/react";
import { Button } from "@/components/ui/button";
import { memoryMachine, shuffledDeck, secretBuffer, SECRET_WORD, PAIR_COUNT } from "@/lib/memory-game";
import { cn } from "@/lib/utils";
import { spring } from "./GlassCard";

const symbols = [Apple, Aperture, Flower2, Gem, Moon, Sparkles];
const names = ["Apple", "Aperture", "Flower", "Gem", "Moon", "Sparkles"];

function GameBoard() {
  const [deckInput] = useState(shuffledDeck);
  const [state, send] = useActor(memoryMachine, { input: { deck: deckInput } });
  const reducedMotion = useReducedMotion();
  const { deck, selected, matched, moves } = state.context;
  const won = state.matches("won");

  return (
    <>
      <div className="mb-5 flex items-center justify-between border-b border-glass-border pb-4 text-sm">
        <span className="text-muted-foreground">Moves <span className="ml-2 font-semibold tabular-nums text-foreground">{moves}</span></span>
        <span className="text-muted-foreground">Pairs <span className="ml-2 font-semibold tabular-nums text-foreground">{matched.length / 2} / {PAIR_COUNT}</span></span>
      </div>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3" aria-label="Memory cards">
        {deck.map((symbol, index) => {
          const revealed = selected.includes(index) || matched.includes(index);
          const found = matched.includes(index);
          const Icon = symbols[symbol] ?? Sparkles;
          return (
            <motion.div key={index} className="memory-tile aspect-square" initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: reducedMotion ? 0 : index * 0.025 }}>
              <Button variant="ghost" className={cn("memory-card h-full w-full p-0 hover:bg-glass-strong", found && "memory-card-matched")}
                aria-label={revealed ? `${names[symbol]}, card ${index + 1}${found ? ", matched" : ""}` : `Reveal card ${index + 1}`}
                aria-pressed={revealed} disabled={revealed || state.matches("waiting") || won}
                onClick={() => send({ type: "FLIP", index })}>
                <motion.span className="memory-flipper" animate={{ rotateY: revealed ? 180 : 0 }} transition={reducedMotion ? { duration: 0 } : spring}>
                  <span className="memory-face"><Aperture className="size-5 text-muted-foreground/50" /></span>
                  <span className="memory-face memory-back"><Icon className="size-7 text-accent sm:size-8" />{found && <Check className="absolute bottom-2 right-2 size-3 text-accent" />}</span>
                </motion.span>
              </Button>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-5 flex min-h-11 items-center justify-between gap-3">
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground">
          {won ? <><Trophy className="size-4 text-accent" /><span className="text-foreground">Beautiful. {moves} moves.</span></> : <span>{matched.length ? "Nice match." : "A little moment of play."}</span>}
        </div>
        <Button variant="ghost" size="icon" title="New game" aria-label="New game" className="shrink-0 rounded-full hover:bg-glass-strong hover:text-foreground" onClick={() => send({ type: "RESET", deck: shuffledDeck() })}><RotateCcw /></Button>
      </div>
    </>
  );
}

export function MemoryGame() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    let buffer = "";
    let lastKey = 0;
    const handleKey = (event: KeyboardEvent) => {
      if (open || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']")) return;
      if (Date.now() - lastKey > 2000) buffer = "";
      lastKey = Date.now();
      buffer = secretBuffer(buffer, event.key);
      if (buffer === SECRET_WORD) { setOpen(true); buffer = ""; }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" aria-label="Open hidden memory game" className="absolute left-1/2 top-0 h-11 w-11 -translate-x-1/2 border-0 bg-transparent p-0 hover:bg-transparent focus-visible:ring-accent" />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild>
            <motion.div className="memory-overlay fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} />
          </Dialog.Overlay>
          <Dialog.Content forceMount asChild aria-describedby="memory-description">
            <motion.div className="memory-dialog fixed inset-0 z-[61] m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[28rem] overflow-y-auto rounded-3xl border p-5 text-foreground outline-none sm:p-7"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 50, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.94, y: reducedMotion ? 0 : 20 }} transition={spring}>
              <header className="mb-6 flex items-start justify-between gap-4">
                <div><p className="mb-2 text-xs uppercase tracking-widest text-accent">Off the clock</p><Dialog.Title className="font-display text-2xl font-semibold">Memory, in glass.</Dialog.Title><Dialog.Description id="memory-description" className="sr-only">Find all six matching pairs of symbols.</Dialog.Description></div>
                <Dialog.Close asChild><Button variant="ghost" size="icon" title="Close game" aria-label="Close game" className="shrink-0 rounded-full hover:bg-glass-strong hover:text-foreground"><X /></Button></Dialog.Close>
              </header>
              <GameBoard />
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  );
}