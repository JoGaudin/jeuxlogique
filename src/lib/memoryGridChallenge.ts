import { hashString, mulberry32 } from "@/lib/seededRng";

/** Grille et nombre de cases « spéciales » à mémoriser pour chaque partie (1–10). */
const ROUND_SPECS: { rows: number; cols: number; specialCount: number }[] = [
  { rows: 3, cols: 3, specialCount: 2 },
  { rows: 3, cols: 3, specialCount: 2 },
  { rows: 3, cols: 3, specialCount: 3 },
  { rows: 3, cols: 3, specialCount: 3 },
  { rows: 4, cols: 3, specialCount: 3 },
  { rows: 4, cols: 3, specialCount: 4 },
  { rows: 4, cols: 4, specialCount: 4 },
  { rows: 4, cols: 4, specialCount: 4 },
  { rows: 4, cols: 4, specialCount: 5 },
  { rows: 5, cols: 4, specialCount: 5 },
];

export const MEMORY_GRID_TOTAL_ROUNDS = ROUND_SPECS.length;

export type MemoryGridChallenge = {
  rows: number;
  cols: number;
  specialIndices: number[];
  peekMs: number;
};

/**
 * Défi déterministe pour une date (Paris) et un index de partie 0..9.
 */
export function buildMemoryGridChallenge(dateKey: string, roundIndex: number): MemoryGridChallenge {
  const spec = ROUND_SPECS[Math.min(roundIndex, ROUND_SPECS.length - 1)]!;
  const { rows, cols, specialCount } = spec;
  const total = rows * cols;
  const rng = mulberry32(hashString(`${dateKey}|memoire-grille|${roundIndex}`));

  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  const specialIndices = indices.slice(0, specialCount).sort((a, b) => a - b);
  const peekMs = 1000 + Math.floor(rng() * 1001);

  return { rows, cols, specialIndices, peekMs };
}

export function setsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}
