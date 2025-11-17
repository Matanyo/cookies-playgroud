// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SERVER_COOKIE_NAME = "server-token";
const SERVER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export function middleware(request: NextRequest) {
  console.log("middleware called");

  // Get existing cookie or create a new one
  const existingCookie = request.cookies.get(SERVER_COOKIE_NAME);
  const cookieValue = existingCookie?.value || `server-${Date.now()}`;

  // Create response
  const response = NextResponse.next();

  // Set the cookie in the response
  response.cookies.set(SERVER_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SERVER_COOKIE_MAX_AGE,
    path: "/",
  });

  // Forward the cookie value as a header so the page can read it
  response.headers.set("x-server-cookie-value", cookieValue);

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
