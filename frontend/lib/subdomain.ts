import { headers } from "next/headers";

/**
 * Get subdomain from request headers (set by middleware)
 * Usage: const subdomain = await getSubdomainFromRequest();
 * Returns: "gusto2" for gusto2.localhost or "gusto2" for gusto2.example.com
 */
export async function getSubdomainFromRequest(): Promise<string | null> {
  try {
    const headersList = await headers();
    const subdomain = headersList.get("x-subdomain");
    return subdomain;
  } catch (error) {
    console.error("Error getting subdomain:", error);
    return null;
  }
}
