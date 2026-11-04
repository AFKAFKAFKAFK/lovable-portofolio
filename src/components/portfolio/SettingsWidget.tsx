import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Settings, X } from "lucide-react";
import { spring } from "./GlassCard";

interface SettingsState {
  accent: string;
  blur: number;
  rainbow: boolean;
}

const DEFAULTS: SettingsState = { accent: "#f5a742", blur: 40, rainbow: false };
const KEY = "portfolio-settings";

export function SettingsWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<SettingsState>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<SettingsState>) });
    } catch {
      /* ignore bad storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--glass-blur", `${s.blur}px`);
    if (s.rainbow) {
      root.style.removeProperty("--accent");
      root.classList.add("rainbow");
    } else {
      root.classList.remove("rainbow");
      root.style.setProperty("--accent", s.accent);
    }
    if (loaded) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, loaded]);

  const update = (patch: Partial<SettingsState>) => setS((prev) => ({ ...prev, ...patch }));

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={spring}
            style={{ transformOrigin: "bottom right" }}
            className="glass w-[min(18rem,calc(100vw-2.5rem))] rounded-3xl p-5"
          >
            <h3 className="text-sm font-semibold">Settings</h3>

            <label className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Accent color</span>
              <input
                type="color"
                value={s.accent}
                disabled={s.rainbow}
                onChange={(e) => update({ accent: e.target.value })}
                className="h-8 w-12 cursor-pointer rounded-lg border-0 bg-transparent disabled:opacity-40"
              />
            </label>

            <label className="mt-5 block text-sm">
              <span className="flex justify-between text-muted-foreground">
                <span>Blur</span>
                <span>{s.blur}px</span>
              </span>
              <input
                type="range"
                min={0}
                max={80}
                value={s.blur}
                onChange={(e) => update({ blur: Number(e.target.value) })}
                className="mt-2 w-full accent-accent"
              />
            </label>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rainbow mode</span>
              <button
                role="switch"
                aria-checked={s.rainbow}
                aria-label="Rainbow mode"
                onClick={() => update({ rainbow: !s.rainbow })}
                className={`relative h-7 w-12 rounded-full transition-colors duration-500 ${s.rainbow ? "bg-accent" : "bg-glass-strong"}`}
              >
                <motion.span
                  layout
                  transition={spring}
                  className={`absolute top-1 h-5 w-5 rounded-full bg-foreground ${s.rainbow ? "right-1" : "left-1"}`}
                />
              </button>
            </div>

            <button
              onClick={() => setS(DEFAULTS)}
              className="mt-5 w-full rounded-full py-2 text-xs text-muted-foreground transition-colors hover:bg-glass-strong hover:text-foreground"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        aria-label={open ? "Close settings" : "Open settings"}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 90 : 0 }}
        transition={spring}
        className="glass flex h-14 w-14 items-center justify-center rounded-full"
      >
        {open ? <X className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
      </motion.button>
    </div>
  );
}
