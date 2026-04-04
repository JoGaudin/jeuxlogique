"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDateKey } from "@/lib/date";
import type { DailyStatusMap, GameId, PersistedAppState, Statistics } from "@/types";

const STORAGE_KEY = "jeux-logique-app-v1";

const defaultStatistics: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestTimesMs: {},
};

const defaultState: PersistedAppState = {
  dailyStatus: {},
  statistics: defaultStatistics,
};

type DailyCompletionContextValue = {
  dateKey: string;
  isCompleted: (gameId: GameId) => boolean;
  markCompleted: (gameId: GameId, options?: { won?: boolean; timeMs?: number }) => void;
  statistics: Statistics;
};

const DailyCompletionContext = createContext<DailyCompletionContextValue | null>(null);

export function DailyCompletionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<PersistedAppState>(STORAGE_KEY, defaultState);

  const dateKey = getDateKey();

  const isCompleted = useCallback(
    (gameId: GameId) => Boolean(state.dailyStatus[dateKey]?.[gameId]),
    [state.dailyStatus, dateKey]
  );

  const markCompleted = useCallback(
    (gameId: GameId, options?: { won?: boolean; timeMs?: number }) => {
      setState((prev) => {
        if (prev.dailyStatus[dateKey]?.[gameId]) return prev;

        const dailyStatus: DailyStatusMap = {
          ...prev.dailyStatus,
          [dateKey]: { ...prev.dailyStatus[dateKey], [gameId]: true },
        };

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = getDateKey(yesterday);
        const playedYesterday = Object.values(prev.dailyStatus[yKey] ?? {}).some(Boolean);

        const won = options?.won !== false;
        const nextStreak = playedYesterday ? prev.statistics.currentStreak + 1 : 1;

        let statistics: Statistics = {
          ...prev.statistics,
          gamesPlayed: prev.statistics.gamesPlayed + 1,
          gamesWon: prev.statistics.gamesWon + (won ? 1 : 0),
          currentStreak: won ? nextStreak : 0,
          bestStreak: won
            ? Math.max(prev.statistics.bestStreak, nextStreak)
            : prev.statistics.bestStreak,
          bestTimesMs: { ...prev.statistics.bestTimesMs },
        };

        if (won && options?.timeMs !== undefined) {
          const prevBest = statistics.bestTimesMs[gameId];
          if (prevBest === undefined || options.timeMs < prevBest) {
            statistics = {
              ...statistics,
              bestTimesMs: { ...statistics.bestTimesMs, [gameId]: options.timeMs },
            };
          }
        }

        return { ...prev, dailyStatus, statistics };
      });
    },
    [dateKey, setState]
  );

  const value = useMemo(
    () => ({
      dateKey,
      isCompleted,
      markCompleted,
      statistics: state.statistics,
    }),
    [dateKey, isCompleted, markCompleted, state.statistics]
  );

  return (
    <DailyCompletionContext.Provider value={value}>
      {children}
    </DailyCompletionContext.Provider>
  );
}

export function useDailyCompletion() {
  const ctx = useContext(DailyCompletionContext);
  if (!ctx) {
    throw new Error("useDailyCompletion doit être utilisé dans DailyCompletionProvider");
  }
  return ctx;
}
