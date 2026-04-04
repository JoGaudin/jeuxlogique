"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import { getCharadeOfTheDayForDateKey } from "@/data/charades";
import { normalizeAnswer } from "@/lib/normalizeText";
import { cn } from "@/lib/utils";

export function CharadeGame() {
  const { dateKey, isCompleted, markCompleted } = useDailyCompletion();
  const charade = useMemo(() => getCharadeOfTheDayForDateKey(dateKey), [dateKey]);

  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const recorded = useRef(false);

  const done = isCompleted("charade");

  const tryRecord = useCallback(
    (won: boolean) => {
      if (recorded.current) return;
      recorded.current = true;
      markCompleted("charade", {
        won,
      });
    },
    [markCompleted]
  );

  const onVerify = () => {
    if (done) return;
    const ok = normalizeAnswer(answer) === normalizeAnswer(charade.answer);
    if (ok) {
      setFeedback("Exact !");
      tryRecord(true);
    } else {
      setFeedback("Ce n’est pas encore ça…");
    }
  };

  const onReveal = () => {
    if (done) return;
    setRevealed(true);
    setFeedback(`La réponse était : ${charade.answer}`);
    tryRecord(false);
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
          <CardTitle className="text-2xl">La charade du jour</CardTitle>
          <CardDescription className="text-base">
            Lisez l’énigme et proposez une réponse en un mot ou une courte expression.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {done && (
            <p className="text-sm text-muted-foreground">
              Charade d’aujourd’hui déjà enregistrée dans vos statistiques.
            </p>
          )}
          <p className="text-lg leading-relaxed">{charade.clue}</p>

          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Votre réponse"
            disabled={done || revealed}
            className="min-h-12 text-lg"
            aria-label="Réponse à la charade"
            onKeyDown={(e) => {
              if (e.key === "Enter") onVerify();
            }}
          />

          {feedback && (
            <p className="text-base text-muted-foreground" role="status">
              {feedback}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="min-h-12 flex-1 text-base"
            onClick={onVerify}
            disabled={done || revealed}
          >
            Vérifier
          </Button>
          <Button
            variant="outline"
            className="min-h-12 flex-1 text-base"
            onClick={onReveal}
            disabled={done || revealed}
          >
            Révéler
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
