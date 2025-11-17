import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SERVER_COOKIE_NAME = "server-token";
const SERVER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function middleware(request: NextRequest) {
  const newServerCookieValue = `server-${Date.now()}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-server-cookie-value", newServerCookieValue);
  const cookieExpiresAt = new Date(Date.now() + SERVER_COOKIE_MAX_AGE * 1000);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set({
    name: SERVER_COOKIE_NAME,
    value: newServerCookieValue,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SERVER_COOKIE_MAX_AGE,
    expires: cookieExpiresAt,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
