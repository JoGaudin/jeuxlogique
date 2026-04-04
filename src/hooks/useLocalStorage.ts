"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persiste une valeur JSON dans `localStorage`, avec relecture si la clé change.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  // Toujours la même valeur initiale qu’au SSR pour éviter les erreurs d’hydratation ;
  // la lecture `localStorage` se fait après montage dans l’effet ci-dessous.
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    setStored(read());
  }, [read]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota / mode privé */
        }
        return next;
      });
    },
    [key]
  );

  return [stored, setValue] as const;
}
