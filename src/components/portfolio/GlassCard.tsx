import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

export const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 } as const;

interface GlassCardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export function GlassCard({ className, interactive = true, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn("glass rounded-3xl", className)}
      whileHover={interactive ? { y: -6, scale: 1.015 } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      transition={spring}
      {...props}
    >
      {children}
    </motion.div>
  );
}
