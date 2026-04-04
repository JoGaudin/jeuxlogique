"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDailyCompletion } from "@/context/DailyCompletionContext";
import {
  MEMORY_GRID_TOTAL_ROUNDS,
  buildMemoryGridChallenge,
  setsEqual,
} from "@/lib/memoryGridChallenge";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "jeux-logique-memoire-grille-round-v1";

type RoundProgressMap = Record<string, number>;

function readRoundForDate(dateKey: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const map = JSON.parse(raw) as RoundProgressMap;
    return map[dateKey] ?? 0;
  } catch {
    return 0;
  }
}

function writeRoundForDate(dateKey: string, round: number) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const map: RoundProgressMap = raw ? (JSON.parse(raw) as RoundProgressMap) : {};
    map[dateKey] = round;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

type Phase = "peek" | "recall" | "feedback";

export function MemoireGrilleGame() {
  const { dateKey, isCompleted, markCompleted } = useDailyCompletion();
  const recorded = useRef(false);

  const [hydratedRound, setHydratedRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("peek");
  const [selected, setSelected] = useState<number[]>([]);
  const [lastOk, setLastOk] = useState<boolean | null>(null);

  const dailyDone = isCompleted("memoire-grille");
  const finishedAll = dailyDone || hydratedRound >= MEMORY_GRID_TOTAL_ROUNDS;

  const roundIndex = finishedAll ? MEMORY_GRID_TOTAL_ROUNDS - 1 : hydratedRound;
  const challenge = useMemo(
    () => buildMemoryGridChallenge(dateKey, Math.min(roundIndex, MEMORY_GRID_TOTAL_ROUNDS - 1)),
    [dateKey, roundIndex]
  );

  const { rows, cols, specialIndices, peekMs } = challenge;
  const k = specialIndices.length;

  const resetRoundVisual = useCallback(() => {
    setPhase("peek");
    setSelected([]);
    setLastOk(null);
  }, []);

  useEffect(() => {
    setHydratedRound(readRoundForDate(dateKey));
  }, [dateKey]);

  useEffect(() => {
    if (dailyDone) return;
    resetRoundVisual();
  }, [dateKey, dailyDone, resetRoundVisual]);

  useEffect(() => {
    if (phase !== "peek" || finishedAll) return;
    const t = window.setTimeout(() => setPhase("recall"), peekMs);
    return () => window.clearTimeout(t);
  }, [phase, peekMs, finishedAll, dateKey, hydratedRound]);

  const toggleCell = (index: number) => {
    if (phase !== "recall" || finishedAll) return;
    setSelected((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      if (prev.length >= k) return prev;
      return [...prev, index];
    });
  };

  const validate = () => {
    if (phase !== "recall" || selected.length !== k || finishedAll) return;
    const ok = setsEqual(selected, specialIndices);
    setLastOk(ok);
    setPhase("feedback");

    if (!ok) return;

    const next = hydratedRound + 1;
    window.setTimeout(() => {
      if (next >= MEMORY_GRID_TOTAL_ROUNDS) {
        writeRoundForDate(dateKey, MEMORY_GRID_TOTAL_ROUNDS);
        setHydratedRound(MEMORY_GRID_TOTAL_ROUNDS);
        if (!recorded.current) {
          recorded.current = true;
          markCompleted("memoire-grille", { won: true });
        }
        return;
      }
      writeRoundForDate(dateKey, next);
      setHydratedRound(next);
      setPhase("peek");
      setSelected([]);
      setLastOk(null);
    }, 850);
  };

  const retryRound = () => {
    if (finishedAll) return;
    resetRoundVisual();
  };

  const displayRound = Math.min(hydratedRound + 1, MEMORY_GRID_TOTAL_ROUNDS);
  const isSpecialVisible = (i: number) =>
    phase === "peek" || (phase === "feedback" && lastOk === false && specialIndices.includes(i));

  const cellClass = (i: number) => {
    const sel = selected.includes(i);
    if (phase === "peek" || (phase === "feedback" && lastOk === false)) {
      return cn(
        "min-h-[3.25rem] min-w-[3.25rem] rounded-lg border-2 text-base font-medium transition-colors sm:min-h-[3.75rem] sm:min-w-[3.75rem]",
        isSpecialVisible(i)
          ? "border-primary bg-primary/25 text-foreground"
          : "border-border bg-muted/40 text-muted-foreground"
      );
    }
    if (phase === "recall") {
      return cn(
        "min-h-[3.25rem] min-w-[3.25rem] rounded-lg border-2 text-base font-medium transition-colors sm:min-h-[3.75rem] sm:min-w-[3.75rem]",
        sel ? "border-primary bg-primary/20" : "border-border bg-card hover:bg-muted/50"
      );
    }
    if (phase === "feedback" && lastOk) {
      const hit = specialIndices.includes(i);
      return cn(
        "min-h-[3.25rem] min-w-[3.25rem] rounded-lg border-2 text-base font-medium sm:min-h-[3.75rem] sm:min-w-[3.75rem]",
        hit ? "border-emerald-500 bg-emerald-500/20" : "border-border bg-muted/30"
      );
    }
    return "min-h-[3.25rem] min-w-[3.25rem] rounded-lg border-2 border-border bg-muted/40 sm:min-h-[3.75rem] sm:min-w-[3.75rem]";
  };

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
          <CardTitle className="text-2xl">Mémoire en grille</CardTitle>
          <CardDescription className="text-base">
            Dix parties par jour : quelques cases se soulignent brièvement. Mémorisez-les, puis
            cliquez sur exactement le même nombre de cases — ni plus, ni moins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {finishedAll ? (
            <p className="text-center text-lg font-medium text-emerald-600">
              Série du jour terminée : les dix grilles sont réussies. À demain !
            </p>
          ) : (
            <>
              <p className="text-center text-base text-muted-foreground" aria-live="polite">
                Partie {displayRound} sur {MEMORY_GRID_TOTAL_ROUNDS}
                {phase === "peek" && " — observez les cases marquées…"}
                {phase === "recall" &&
                  ` — sélectionnez ${k} case${k > 1 ? "s" : ""} (${selected.length}/${k})`}
                {phase === "feedback" && lastOk === false && " — ce n’était pas exact."}
                {phase === "feedback" && lastOk && " — partie réussie !"}
              </p>

              <div
                className="mx-auto grid w-fit gap-2"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
                role="grid"
                aria-label="Grille de cartes"
              >
                {Array.from({ length: rows * cols }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    disabled={phase !== "recall" || finishedAll}
                    onClick={() => toggleCell(i)}
                    className={cellClass(i)}
                  >
                    {phase === "peek" && specialIndices.includes(i) ? "●" : ""}
                    {phase === "recall" && selected.includes(i) ? "✓" : ""}
                    {phase === "feedback" && lastOk === false && specialIndices.includes(i)
                      ? "●"
                      : ""}
                  </button>
                ))}
              </div>

              {phase === "recall" && (
                <Button
                  type="button"
                  className="min-h-12 w-full text-base"
                  disabled={selected.length !== k}
                  onClick={validate}
                >
                  Valider ({selected.length}/{k})
                </Button>
              )}

              {phase === "feedback" && lastOk === false && (
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-12 w-full text-base"
                  onClick={retryRound}
                >
                  Réessayer cette partie
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
