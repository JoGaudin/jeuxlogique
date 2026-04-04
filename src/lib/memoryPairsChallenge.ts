import { hashString, mulberry32 } from "@/lib/seededRng";

const EMOJI_POOL = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🚗",
  "✈️",
  "⭐",
  "🌙",
  "🐱",
  "🐶",
  "⚽",
  "🏀",
  "🎸",
  "📚",
  "🎨",
  "🔑",
  "☕",
  "🍕",
  "🌼",
  "🏠",
  "🎈",
  "🧩",
  "🎮",
  "🌈",
] as const;

export const MEMORY_PAIRS_COUNT = 8;
export const MEMORY_PAIRS_GRID_COLS = 4;

export type MemoryPairCard = {
  id: number;
  pairId: number;
  symbol: string;
};

function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/**
 * 8 paires (16 cartes), symboles et placement déterministes pour la date (Paris).
 */
export function buildMemoryPairsLayout(dateKey: string): MemoryPairCard[] {
  const rng = mulberry32(hashString(`${dateKey}|memoire-paires`));
  const poolIndices = Array.from({ length: EMOJI_POOL.length }, (_, i) => i);
  shuffleInPlace(poolIndices, rng);
  const chosen = poolIndices.slice(0, MEMORY_PAIRS_COUNT).map((i) => EMOJI_POOL[i]!);

  const cards: MemoryPairCard[] = [];
  let id = 0;
  for (let pairId = 0; pairId < chosen.length; pairId++) {
    const symbol = chosen[pairId]!;
    cards.push({ id: id++, pairId, symbol });
    cards.push({ id: id++, pairId, symbol });
  }
  shuffleInPlace(cards, rng);
  return cards;
}
