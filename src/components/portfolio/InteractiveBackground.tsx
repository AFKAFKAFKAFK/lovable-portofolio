import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

const orbs = [
  { size: 420, top: "10%", left: "8%", depth: 60, color: "var(--accent)" },
  { size: 340, top: "55%", left: "70%", depth: -80, color: "oklch(0.7 0.14 200)" },
  { size: 280, top: "70%", left: "15%", depth: 40, color: "oklch(0.68 0.18 25)" },
];

function Orb({ o, mx, my }: { o: (typeof orbs)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * o.depth);
  const y = useTransform(my, (v) => v * o.depth);
  return (
    <motion.div
      className="absolute rounded-full opacity-40 mix-blend-screen blur-3xl will-change-transform"
      style={{ width: o.size, height: o.size, top: o.top, left: o.left, x, y, background: o.color }}
    />
  );
}

/** Fixed glowing orbs that drift toward the cursor. Uses motion values only — no React re-renders. */
export function InteractiveBackground() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 40, damping: 20 });
  const my = useSpring(rawY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      {orbs.map((o, i) => (
        <Orb key={i} o={o} mx={mx} my={my} />
      ))}
    </div>
  );
}
