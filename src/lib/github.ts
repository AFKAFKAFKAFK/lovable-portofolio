export interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
}

export const GITHUB_USER = "AFKAFKAFKAFK";
export const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEY = `gh-repos-${GITHUB_USER}`;

interface CacheEntry {
  at: number;
  repos: Repo[];
}

export function isFresh(entry: CacheEntry | null, now = Date.now()): boolean {
  return !!entry && now - entry.at < CACHE_TTL_MS;
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheEntry) : null;
  } catch {
    return null;
  }
}

/** Returns cached repos if under 5 minutes old, otherwise fetches fresh (newest first). */
export async function getRepos(force = false): Promise<Repo[]> {
  const cached = readCache();
  if (!force && cached && isFresh(cached)) return cached.repos;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=created&direction=desc&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) {
      throw new Error(
        res.status === 403 ? "GitHub rate limit reached. Try again later." : `GitHub returned ${res.status}`,
      );
    }
    const data = (await res.json()) as Repo[];
    const repos = Array.isArray(data) ? data : [];
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
    } catch {
      /* storage full or blocked */
    }
    return repos;
  } catch (err) {
    // Fall back to stale cache rather than breaking the UI
    if (cached) return cached.repos;
    throw err instanceof Error ? err : new Error("Could not load repositories");
  }
}
