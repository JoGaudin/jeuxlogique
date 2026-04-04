"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GameCardProps } from "@/types";
import { cn } from "@/lib/utils";

export function GameCard({
  title,
  description,
  icon,
  isCompleted,
  href,
}: GameCardProps) {
  return (
    <Card
      className={cn(
        "h-full min-h-[12rem] transition-shadow",
        !isCompleted && "ring-2 ring-primary/20"
      )}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="text-xl leading-tight">{title}</CardTitle>
          <CardDescription className="text-base leading-snug">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isCompleted ? (
          <Badge
            variant="secondary"
            className="min-h-12 min-w-[7rem] justify-center rounded-lg bg-emerald-600 px-4 text-base text-white hover:bg-emerald-600"
          >
            Terminé
          </Badge>
        ) : (
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "inline-flex min-h-12 w-full items-center justify-center text-base sm:w-auto"
            )}
          >
            Jouer
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
