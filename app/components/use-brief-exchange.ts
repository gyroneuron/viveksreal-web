"use client";
import { useEffect, useRef, useState } from "react";
import type { ExchangeRate } from "../brief";

export const briefRateEndpoint = "https://api.frankfurter.dev/v2/rate/USD/INR";
export function useBriefExchange(enabled: boolean) {
  const [exchange, setExchange] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  const cached = useRef<{ value: ExchangeRate; fetchedAt: number } | null>(
    null,
  );
  useEffect(() => {
    if (!enabled) return;
    if (
      cached.current &&
      Date.now() - cached.current.fetchedAt < 15 * 60 * 1000
    )
      return;
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 8000);
    setLoading(true);
    setFailed(false);
    void (async () => {
      try {
        const response = await fetch(briefRateEndpoint, {
          signal: controller.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
        });
        if (!response.ok) throw Error("Rate unavailable");
        const data = await response.json();
        if (
          data.base !== "USD" ||
          data.quote !== "INR" ||
          typeof data.rate !== "number" ||
          !Number.isFinite(data.rate) ||
          data.rate <= 0 ||
          data.rate > 1_000_000 ||
          typeof data.date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
          Number.isNaN(Date.parse(data.date))
        )
          throw Error("Invalid reference rate");
        if (disposed) return;
        const value = { date: data.date, rate: data.rate };
        cached.current = { value, fetchedAt: Date.now() };
        setExchange(value);
      } catch {
        if (!disposed) {
          setFailed(true);
          setExchange(null);
        }
      } finally {
        clearTimeout(timeout);
        if (!disposed) setLoading(false);
      }
    })();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [enabled, revision]);
  return {
    exchange,
    loading,
    failed,
    retry: () => {
      cached.current = null;
      setRevision((value) => value + 1);
    },
  };
}
