"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "client-preference";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

function readCookie(): string {
  if (typeof document === "undefined") {
    return "";
  }

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

export function ClientCookieControls() {
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    const newValue = `client-${Date.now()}`;
    const encodedValue = encodeURIComponent(newValue);
    const expires = new Date(
      Date.now() + COOKIE_MAX_AGE_SECONDS * 1000
    ).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodedValue}; path=/; expires=${expires}; samesite=lax`;
    setCurrentValue(newValue);
  }, []);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-4 shadow-sm">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Client cookie
        </p>
        <p className="text-base text-zinc-700">
          Generates a fresh browser cookie on every page load (1 year expiry).
        </p>
      </header>

      <div className="rounded-lg bg-zinc-100 p-3 text-sm">
        Current value:{" "}
        <span className="font-mono text-zinc-800">
          {currentValue || "(not set)"}
        </span>
      </div>
    </section>
  );
}

export function ClientCookieSummary() {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(readCookie());
  }, []);

  return (
    <span className="font-mono text-sm text-zinc-600">
      client: {value || "(not set)"}
    </span>
  );
}
