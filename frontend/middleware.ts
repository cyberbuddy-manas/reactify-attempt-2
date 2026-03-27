import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to extract subdomain from request
 * Supports:
 * - Development: gusto2.localhost:3000
 * - Production: gusto2.example.com
 */

function extractSubdomain(hostname: string): string | null {
  // Remove port number
  const host = hostname.split(":")[0];

  // Development: localhost
  if (host.endsWith(".localhost")) {
    const subdomain = host.replace(".localhost", "");
    return subdomain && subdomain !== "localhost" ? subdomain : null;
  }

  // Production: custom domain (e.g., gusto2.example.com)
  // Assumes main domain is at least 2 parts: example.com
  const parts = host.split(".");
  if (parts.length > 2) {
    // Has subdomain (e.g., gusto2.example.com -> gusto2)
    return parts[0];
  }

  return null;
}

export function middleware(request: NextRequest) {
  try {
    const host = request.headers.get("host") || "";
    const subdomain = extractSubdomain(host);

    // If subdomain found, add it to request headers
    if (subdomain) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-subdomain", subdomain);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|api|healthz).*)"],
};
