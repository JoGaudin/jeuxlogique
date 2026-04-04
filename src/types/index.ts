import type { ReactNode } from "react";

export type GameId = "memoire-grille" | "memoire-paires" | "charade";

/** Complétion des jeux pour une date donnée (clé = `YYYY-MM-DD`). */
export type DailyStatusMap = Record<string, Partial<Record<GameId, boolean>>>;

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  /** Meilleur temps en ms par jeu (optionnel). */
  bestTimesMs: Partial<Record<GameId, number>>;
}

/** Données persistées côté client. */
export interface PersistedAppState {
  dailyStatus: DailyStatusMap;
  statistics: Statistics;
}

export interface Charade {
  clue: string;
  answer: string;
}

/** Props du dashboard pour une carte de jeu. */
export interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isCompleted: boolean;
  href: string;
}

