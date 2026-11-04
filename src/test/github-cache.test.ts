import { describe, it, expect } from "vitest";
import { isFresh, CACHE_TTL_MS } from "@/lib/github";

describe("GitHub cache", () => {
  it("lasts 5 minutes", () => {
    expect(CACHE_TTL_MS).toBe(300000);
    const now = 1_000_000;
    expect(isFresh({ at: now - 299_000, repos: [] }, now)).toBe(true);
    expect(isFresh({ at: now - 301_000, repos: [] }, now)).toBe(false);
  });
});
