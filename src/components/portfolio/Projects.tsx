import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, RefreshCw } from "lucide-react";
import { spring } from "./GlassCard";
import { TiltCard } from "./TiltCard";
import { getRepos, GITHUB_USER, CACHE_TTL_MS, type Repo } from "@/lib/github";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; repos: Repo[] };

function SkeletonCard() {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-glass-strong" />
      <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-glass" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-glass" />
      <div className="mt-6 flex gap-3">
        <div className="h-4 w-16 animate-pulse rounded-full bg-glass-strong" />
        <div className="h-4 w-12 animate-pulse rounded-full bg-glass-strong" />
      </div>
    </div>
  );
}

export function Projects() {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async (force = false) => {
    if (force) setState({ status: "loading" });
    try {
      const repos = await getRepos(force);
      setState({ status: "ready", repos });
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Something went wrong" });
    }
  }, []);

  useEffect(() => {
    void load();
    // re-check after the cache expires so new repos appear without a reload
    const id = setInterval(() => void load(), CACHE_TTL_MS);
    return () => clearInterval(id);
  }, [load]);

  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Selected Work</h2>
        <p className="mt-3 text-muted-foreground">Live from GitHub · @{GITHUB_USER}</p>
      </div>

      {state.status === "loading" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="glass mx-auto max-w-md rounded-3xl p-8 text-center">
          <p className="font-medium">Couldn't load repositories</p>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
          <motion.button
            onClick={() => void load(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </motion.button>
        </div>
      )}

      {state.status === "ready" && state.repos.length === 0 && (
        <p className="text-center text-muted-foreground">No public repositories yet.</p>
      )}

      {state.status === "ready" && state.repos.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {state.repos.map((r, i) => (
            <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer" className="block">
              <TiltCard delay={(i % 3) * 0.08}>
                <div className="flex h-full flex-col p-6">
                <h3 className="truncate text-lg font-semibold">{r.name}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {r.description ?? "No description provided."}
                </p>
                <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                      {r.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" /> {r.stargazers_count}
                  </span>
                </div>
                </div>
              </TiltCard>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
