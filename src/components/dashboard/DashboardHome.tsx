"use client";

import { Copy, LayoutGrid, Lightbulb, History } from "lucide-react";
import { GameCard } from "@/components/dashboard/GameCard";
import { useDailyCompletion } from "@/context/DailyCompletionContext";

const iconClass = "size-8";

export function DashboardHome() {
  const { isCompleted, statistics } = useDailyCompletion();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-10">
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Jeux de logique du jour
        </h1>
        <p className="text-lg text-muted-foreground">
          Des défis quotidiens pensés pour tablette : grosses zones tactiles, pas d’actions au
          survol.
        </p>
      </header>

      <section
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Liste des jeux"
      >
        <GameCard
          title="Mémoire en grille"
          description="Dix parties : mémorisez les cases marquées, puis retrouvez-les au clic."
          icon={<LayoutGrid className={iconClass} aria-hidden />}
          isCompleted={isCompleted("memoire-grille")}
          href="/memoire-grille"
        />
        <GameCard
          title="Mémoire des paires"
          description="Huit paires de cartes : un plateau différent chaque jour."
          icon={<Copy className={iconClass} aria-hidden />}
          isCompleted={isCompleted("memoire-paires")}
          href="/memoire-paires"
        />
        <GameCard
          title="La charade du jour"
          description="Devinez la réponse cachée derrière l’énigme."
          icon={<Lightbulb className={iconClass} aria-hidden />}
          isCompleted={isCompleted("charade")}
          href="/charade"
        />
        <GameCard
          title="Le mot d'hier"
          description="Retrouvez le mot de la veille à partir du mot du jour."
          icon={<History className={iconClass} aria-hidden />}
          isCompleted={isCompleted("mot-hier")}
          href="/mot-hier"
        />
      </section>

      <footer className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Statistiques</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          <li>Parties jouées : {statistics.gamesPlayed}</li>
          <li>Victoires : {statistics.gamesWon}</li>
          <li>Série en cours : {statistics.currentStreak} jour(s)</li>
          <li>Meilleure série : {statistics.bestStreak} jour(s)</li>
        </ul>
      </footer>
    </div>
  );
}
