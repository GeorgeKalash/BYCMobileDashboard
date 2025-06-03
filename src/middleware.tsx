import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/auth");
  const hasToken = request.cookies.has("access_token");

  if (!isAuthRoute && !hasToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(
      new URL("/en/Byc_Pages/Home_Page", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json|icons|fonts).*)",
  ],
};
