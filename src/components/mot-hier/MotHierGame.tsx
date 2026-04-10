"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDailyCompletion } from "@/context/DailyCompletionContext";
import { getMotDuJourForDateKey } from "@/data/motHierWords";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { previousDateKey } from "@/lib/date";
import { normalizeAnswer } from "@/lib/normalizeText";
import { cn } from "@/lib/utils";

type MotHierState = {
  lastSeenDateKey: string | null;
};

const STORAGE_KEY = "jeux-logique-mot-hier-v1";
const INITIAL_STATE: MotHierState = {
  lastSeenDateKey: null,
};

export function MotHierGame() {
  const { dateKey, isCompleted, markCompleted } = useDailyCompletion();
  const [state, setState] = useLocalStorage<MotHierState>(STORAGE_KEY, INITIAL_STATE);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const recorded = useRef(false);

  const done = isCompleted("mot-hier");
  const yesterdayKey = useMemo(() => previousDateKey(dateKey), [dateKey]);
  const motDuJour = useMemo(() => getMotDuJourForDateKey(dateKey), [dateKey]);
  const motDHier = useMemo(() => getMotDuJourForDateKey(yesterdayKey), [yesterdayKey]);

  const canAttemptGuess = state.lastSeenDateKey === yesterdayKey;
  const isFirstVisit = state.lastSeenDateKey === null;
  const needsCatchUp = !canAttemptGuess;

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    recorded.current = false;
  }, [dateKey]);

  const finalizeDay = useCallback(
    (won: boolean) => {
      if (recorded.current) return;
      recorded.current = true;
      markCompleted("mot-hier", { won });
      setState({ lastSeenDateKey: dateKey });
    },
    [dateKey, markCompleted, setState]
  );

  const onValidate = () => {
    if (done || needsCatchUp) return;
    const ok = normalizeAnswer(answer) === normalizeAnswer(motDHier);
    if (ok) {
      setFeedback("Exact, c'était bien le mot d'hier !");
      finalizeDay(true);
      return;
    }
    setFeedback("Pas encore. Reessayez.");
  };

  const onReveal = () => {
    if (done || needsCatchUp) return;
    setFeedback(`Le mot d'hier etait : ${motDHier}`);
    finalizeDay(false);
  };

  const onCatchUp = () => {
    if (done) return;
    setFeedback(
      `Aujourd'hui, retenez "${motDuJour}". Revenez demain pour tenter de retrouver le mot d'hier.`
    );
    finalizeDay(true);
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
          <CardTitle className="text-2xl">Le mot d&apos;hier</CardTitle>
          <CardDescription className="text-base">
            Chaque jour, un mot est affiche. Le lendemain, vous devez retrouver le mot de la veille.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Mot du jour : <span className="font-semibold">{motDuJour}</span>
          </p>

          {needsCatchUp ? (
            <p className="text-base text-muted-foreground">
              {isFirstVisit
                ? `Premiere visite : impossible de deviner le mot d'hier.`
                : `Vous n'avez pas joue hier, donc impossible de connaitre le mot d'hier.`}{" "}
              Le mot d&apos;hier etait <span className="font-medium">{motDHier}</span>.
            </p>
          ) : (
            <>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Entrez le mot d'hier"
                disabled={done}
                className="min-h-12 text-lg"
                aria-label="Reponse pour le mot d'hier"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onValidate();
                }}
              />
            </>
          )}

          {feedback && (
            <p className="text-base text-muted-foreground" role="status">
              {feedback}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          {needsCatchUp ? (
            <Button className="min-h-12 flex-1 text-base" onClick={onCatchUp} disabled={done}>
              J&apos;ai retenu le mot du jour
            </Button>
          ) : (
            <>
              <Button className="min-h-12 flex-1 text-base" onClick={onValidate} disabled={done}>
                Verifier
              </Button>
              <Button
                variant="outline"
                className="min-h-12 flex-1 text-base"
                onClick={onReveal}
                disabled={done}
              >
                Reveler
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
