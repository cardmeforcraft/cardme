import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_jwt_auth_protection_cardme_2026";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // Protect Admin UI Pages
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (token) {
        const isValid = await verifyToken(token, JWT_SECRET);
        if (isValid) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return NextResponse.next();
    }

    // Admin dashboard - redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await verifyToken(token, JWT_SECRET);
    if (!isValid) {
      // Clear invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.next();
  }

  // Protect API Routes
  if (pathname.startsWith("/api/")) {
    let requiresAuth = false;

    // Check path matches
    if (pathname === "/api/products" || pathname.startsWith("/api/products/")) {
      // GET is public, POST/PUT/DELETE is admin only
      if (request.method !== "GET") {
        requiresAuth = true;
      }
    } else if (pathname === "/api/orders" || pathname.startsWith("/api/orders/")) {
      // POST is public (checkout), GET/PUT/DELETE is admin only
      if (request.method !== "POST") {
        requiresAuth = true;
      }
    } else if (pathname === "/api/config") {
      // GET is public, POST is admin only
      if (request.method !== "GET") {
        requiresAuth = true;
      }
    } else if (pathname === "/api/seed") {
      // Re-seeding is admin only
      requiresAuth = true;
    } else if (pathname === "/api/upload") {
      // Image upload is admin only
      requiresAuth = true;
    }

    if (requiresAuth) {
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access: Please log in." },
          { status: 401 }
        );
      }

      const isValid = await verifyToken(token, JWT_SECRET);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access: Invalid session." },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
