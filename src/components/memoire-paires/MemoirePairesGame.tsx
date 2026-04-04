"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDailyCompletion } from "@/context/DailyCompletionContext";
import {
  MEMORY_PAIRS_GRID_COLS,
  buildMemoryPairsLayout,
} from "@/lib/memoryPairsChallenge";
import { cn } from "@/lib/utils";

const FLIP_BACK_MS = 750;

export function MemoirePairesGame() {
  const { dateKey, isCompleted, markCompleted } = useDailyCompletion();
  const recorded = useRef(false);

  const layout = useMemo(() => buildMemoryPairsLayout(dateKey), [dateKey]);

  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(() => new Set());
  const [lockBoard, setLockBoard] = useState(false);

  const dailyDone = isCompleted("memoire-paires");
  const allMatched = matchedPairIds.size === layout.length / 2;

  const resetForNewDay = useCallback(() => {
    setFlippedIds([]);
    setMatchedPairIds(new Set());
    setLockBoard(false);
  }, []);

  useEffect(() => {
    resetForNewDay();
    recorded.current = false;
  }, [dateKey, resetForNewDay]);

  useEffect(() => {
    if (dailyDone || !allMatched) return;
    if (recorded.current) return;
    recorded.current = true;
    markCompleted("memoire-paires", { won: true });
  }, [allMatched, dailyDone, markCompleted]);

  const onCardPress = (cardId: number, pairId: number) => {
    if (dailyDone || lockBoard || allMatched) return;
    if (matchedPairIds.has(pairId)) return;
    if (flippedIds.includes(cardId)) return;
    if (flippedIds.length >= 2) return;

    const nextFlipped = [...flippedIds, cardId];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length < 2) return;

    const [a, b] = nextFlipped;
    const cardA = layout.find((c) => c.id === a);
    const cardB = layout.find((c) => c.id === b);
    if (!cardA || !cardB) return;

    if (cardA.pairId === cardB.pairId) {
      setMatchedPairIds((prev) => {
        const next = new Set(prev);
        next.add(cardA.pairId);
        return next;
      });
      setFlippedIds([]);
      return;
    }

    setLockBoard(true);
    window.setTimeout(() => {
      setFlippedIds([]);
      setLockBoard(false);
    }, FLIP_BACK_MS);
  };

  const isFaceUp = (card: { id: number; pairId: number }) =>
    dailyDone || matchedPairIds.has(card.pairId) || flippedIds.includes(card.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "min-h-12 w-fit justify-center text-base"
          )}
        >
          ← Accueil
        </Link>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mémoire des paires</CardTitle>
          <CardDescription className="text-base">
            Retournez deux cartes à la fois : quand les symboles sont identiques, la paire reste
            visible. Trouvez les huit paires du jour — elles changent chaque matin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dailyDone && !allMatched ? (
            <p className="text-center text-lg font-medium text-emerald-600">
              Déjà terminé aujourd’hui. Voici le plateau du jour — revenez demain pour un nouveau
              jeu !
            </p>
          ) : allMatched ? (
            <p className="text-center text-lg font-medium text-emerald-600">
              Bravo : toutes les paires sont trouvées. À demain pour un nouveau jeu !
            </p>
          ) : (
            <p className="text-center text-base text-muted-foreground" aria-live="polite">
              Paires trouvées : {matchedPairIds.size} / {layout.length / 2}
            </p>
          )}

          <div
            className="mx-auto grid w-full max-w-md gap-3"
            style={{
              gridTemplateColumns: `repeat(${MEMORY_PAIRS_GRID_COLS}, minmax(0, 1fr))`,
            }}
            role="group"
            aria-label="Cartes du jeu de mémoire"
          >
            {layout.map((card) => {
              const up = isFaceUp(card);
              const done = dailyDone || matchedPairIds.has(card.pairId);
              return (
                <button
                  key={card.id}
                  type="button"
                  disabled={dailyDone || done || lockBoard || (flippedIds.length >= 2 && !up)}
                  onClick={() => onCardPress(card.id, card.pairId)}
                  aria-label={up ? `Carte ${card.symbol}` : "Carte face cachée"}
                  className={cn(
                    "flex aspect-square min-h-[4rem] items-center justify-center rounded-xl border-2 text-3xl transition-all duration-200 sm:min-h-[4.5rem] sm:text-4xl",
                    up
                      ? done
                        ? "border-emerald-500 bg-emerald-500/15"
                        : "border-primary bg-primary/10"
                      : "border-border bg-muted/50 hover:bg-muted active:scale-[0.98]",
                    (dailyDone || lockBoard) && !up && "opacity-90"
                  )}
                >
                  <span
                    className={cn(
                      "select-none transition-opacity duration-200",
                      up ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden
                  >
                    {card.symbol}
                  </span>
                </button>
              );
            })}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
