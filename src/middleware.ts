import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes at edge
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookies = request.cookies.getAll();
    const hasAuthToken = cookies.some(
      (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
    );

    if (!hasAuthToken) {
      const loginUrl = new URL("/admin/login", request.url);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.headers.set(
        "Cache-Control",
        "private, no-cache, no-store, max-age=0, must-revalidate"
      );
      return redirectRes;
    }
  }

  // Edge Security Headers (Defense-in-depth alongside next.config.ts)
  const response = NextResponse.next();

  // Prevent CDN / Browser caching of any admin routes
  if (pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, max-age=0, must-revalidate"
    );
  }

  // Edge Security Headers (Defense-in-depth alongside next.config.ts)
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2|ico)$).*)",
  ],
};
