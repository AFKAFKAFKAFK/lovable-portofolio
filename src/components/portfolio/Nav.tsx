import { motion } from "motion/react";
import { spring } from "./GlassCard";

const links = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Work" },
];

export function Nav() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="glass fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5"
    >
      <span className="px-4 font-display text-sm font-semibold">NG</span>
      {links.map((l) => (
        <motion.a
          key={l.href}
          href={l.href}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={spring}
          className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass-strong hover:text-foreground"
        >
          {l.label}
        </motion.a>
      ))}
    </motion.nav>
  );
}
