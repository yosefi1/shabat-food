/**
 * proxy.ts  (previously middleware.ts — renamed for Next.js 16)
 *
 * Protects all /admin/** routes and /api/admin/** API routes.
 * Unauthenticated requests are redirected to /admin/login (pages)
 * or receive a 401 JSON response (API routes).
 *
 * PUBLIC exceptions (no auth required):
 *   - /admin/login
 *   - /api/admin/auth/login
 *   - /api/admin/auth/logout
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ── Admin PAGE routes ─────────────────────────────────────────────────── */
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* ── Admin API routes ──────────────────────────────────────────────────── */
  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { success: false, message: "נדרש אימות — אנא התחבר מחדש" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
