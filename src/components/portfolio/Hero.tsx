import { motion } from "motion/react";
import { GlassCard, spring } from "./GlassCard";

export function Hero() {
  return (
    <section id="home" className="flex min-h-screen items-center justify-center px-4 pb-16 pt-28 sm:px-6">
      <GlassCard
        interactive={false}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="w-full max-w-4xl p-8 text-center sm:p-12 lg:p-16"
      >
        <span className="glass inline-block rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Available for work
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Hi, I'm Nizam.
          <br />
          <span className="text-muted-foreground">I design & build for the web.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          A developer crafting thoughtful, fluid interfaces where every detail feels natural to touch.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <motion.a
            href="#work"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-lg"
          >
            View my work
          </motion.a>
          <motion.a
            href="mailto:hello@example.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="glass rounded-full px-7 py-3 font-medium"
          >
            Get in touch
          </motion.a>
        </div>
      </GlassCard>
    </section>
  );
}
