import {
  ClientCookieControls,
  ClientCookieSummary,
} from "@/components/ClientCookieControls";
import { headers } from "next/headers";

export default async function Home() {
  const headerStore = await headers();
  const currentServerCookie =
    headerStore.get("x-server-cookie-value") ?? "(not set)";

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Cookies playground
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">Client vs Server</h1>
          <p className="text-zinc-600">
            Each page load writes a fresh browser cookie plus a new HTTP-only
            server cookie. Both stick around for a year unless you reload again.
          </p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <ClientCookieSummary />
            <span className="font-mono">server: {currentServerCookie}</span>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <ClientCookieControls />

          <section className="flex flex-col gap-3 rounded-xl border border-zinc-300 p-4 shadow-sm">
            <header className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Server cookie
              </p>
              <p className="text-base text-zinc-700">
                Automatically set on the server using the <code>cookies()</code>{" "}
                API.
              </p>
            </header>

            <div className="rounded-lg bg-zinc-100 p-3 text-sm">
              Current value:{" "}
              <span className="font-mono text-zinc-800">
                {currentServerCookie}
              </span>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
