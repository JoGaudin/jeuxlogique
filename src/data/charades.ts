import type { Charade } from "@/types";
import { dayOfYearFromDateKey, getDayOfYear } from "@/lib/date";

export const CHARADES: readonly Charade[] = [
  {
    clue: "Mon premier est un récipient. Mon second est une voyelle. Mon tout est une boisson chaude.",
    answer: "theiere",
  },
  {
    clue: "Mon premier est un insecte qui pique. Mon second est la négation de oui. Mon tout est un légume vert.",
    answer: "brocoli",
  },
  {
    clue: "Mon premier se trouve sur la tête. Mon second est un pronom. Mon tout est un fruit jaune.",
    answer: "banane",
  },
  {
    clue: "Mon premier est un mammifère marin. Mon second est une note de musique. Mon tout est un meuble.",
    answer: "armoire",
  },
  {
    clue: "Je suis ronde, garnie de sauce et souvent de fromage. Qui suis-je ?",
    answer: "pizza",
  },
];

export function getCharadeOfTheDay(date: Date = new Date()): Charade {
  const n = CHARADES.length;
  if (n === 0) {
    return { clue: "Charade indisponible.", answer: "repos" };
  }
  const i = getDayOfYear(date) % n;
  return CHARADES[i]!;
}

/** Même indice que `getCharadeOfTheDay` pour une clé `YYYY-MM-DD` (SSR / client identiques). */
export function getCharadeOfTheDayForDateKey(dateKey: string): Charade {
  const n = CHARADES.length;
  if (n === 0) {
    return { clue: "Charade indisponible.", answer: "repos" };
  }
  const i = dayOfYearFromDateKey(dateKey) % n;
  return CHARADES[i]!;
}
