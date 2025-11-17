import {
  ClientCookieControls,
  ClientCookieSummary,
} from "@/components/ClientCookieControls";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const SERVER_COOKIE_NAME = "server-token";
const SERVER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

async function setServerCookie(formData: FormData) {
  "use server";

  const value = formData.get("serverValue")?.toString().trim();
  const cookieStore = await cookies();

  if (!value) {
    cookieStore.delete(SERVER_COOKIE_NAME);
    revalidatePath("/");
    return;
  }

  cookieStore.set({
    name: SERVER_COOKIE_NAME,
    value,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SERVER_COOKIE_MAX_AGE,
  });

  revalidatePath("/");
}

async function clearServerCookie() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(SERVER_COOKIE_NAME);
  revalidatePath("/");
}

export default async function Home() {
  const cookieStore = await cookies();
  const currentServerCookie = cookieStore.get(SERVER_COOKIE_NAME)?.value ?? "";

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans text-zinc-900">
      <main className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Cookies playground
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">Client vs Server</h1>
          <p className="text-zinc-600">
            Use the controls below to set a cookie in the browser (client-side)
            and an HTTP-only cookie managed by the server. Refresh the page or
            re-run actions to see how each behaves.
          </p>
          <div className="flex gap-4 text-sm text-zinc-500">
            <ClientCookieSummary />
            <span className="font-mono">
              server: {currentServerCookie || "(not set)"}
            </span>
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
                Managed with the <code>cookies()</code> API inside a server
                action.
              </p>
            </header>

            <div className="rounded-lg bg-zinc-100 p-3 text-sm">
              Current value:{" "}
              <span className="font-mono text-zinc-800">
                {currentServerCookie || "(not set)"}
              </span>
            </div>

            <form
              action={setServerCookie}
              className="flex flex-col gap-2 text-sm"
            >
              <label className="flex flex-col gap-1">
                <span className="font-medium text-zinc-700">New value</span>
                <input
                  name="serverValue"
                  placeholder="e.g. token-123"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-base outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-900"
              >
                Save cookie
              </button>
            </form>

            <form action={clearServerCookie}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
              >
                Clear cookie
              </button>
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}
