const PARIS_TZ = "Europe/Paris";

/** Reconstruit une date locale à partir d’une clé `YYYY-MM-DD` (minuit, fuseau du moteur). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

/**
 * Jour civil à Paris `YYYY-MM-DD` (aligne SSR et client, contrairement au fuseau du serveur).
 */
export function getDateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

/** Jour de l’année 1–366 pour une clé `YYYY-MM-DD` (calendrier, sans ambiguïté de fuseau). */
export function dayOfYearFromDateKey(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  if (y === undefined || m === undefined || d === undefined) return 1;
  const start = Date.UTC(y, 0, 1);
  const noon = Date.UTC(y, m - 1, d, 12, 0, 0);
  return Math.floor((noon - start) / 86_400_000) + 1;
}

/** Jour de l’année 1–366 selon le calendrier Paris (même logique que `getDateKey`). */
export function getDayOfYear(date: Date = new Date()): number {
  return dayOfYearFromDateKey(getDateKey(date));
}
