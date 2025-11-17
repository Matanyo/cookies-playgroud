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
  const [pendingValue, setPendingValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    setCurrentValue(readCookie());
  }, []);

  const syncCookie = () => {
    setCurrentValue(readCookie());
  };

  const handleSave = () => {
    const encodedValue = encodeURIComponent(pendingValue.trim());
    const expires = new Date(
      Date.now() + COOKIE_MAX_AGE_SECONDS * 1000
    ).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodedValue}; path=/; expires=${expires}; samesite=lax`;
    syncCookie();
    setPendingValue("");
  };

  const handleClear = () => {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    syncCookie();
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-4 shadow-sm">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Client cookie
        </p>
        <p className="text-base text-zinc-700">
          Updates via <code>document.cookie</code>.
        </p>
      </header>

      <div className="rounded-lg bg-zinc-100 p-3 text-sm">
        Current value:{" "}
        <span className="font-mono text-zinc-800">
          {currentValue || "(not set)"}
        </span>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">New value</span>
        <input
          value={pendingValue}
          onChange={(event) => setPendingValue(event.target.value)}
          placeholder="e.g. light, dark"
          className="rounded-md border border-zinc-300 px-3 py-2 text-base outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!pendingValue.trim()}
          className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          Save cookie
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
        >
          Clear cookie
        </button>
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
