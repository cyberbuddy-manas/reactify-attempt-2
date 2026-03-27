import type { Metadata } from "next";
import { getSubdomainFromRequest } from "@/lib/subdomain";
import { RestaurantTemplate } from "@/components/RestaurantTemplate";
import { VTapHomepage } from "@/components/VTapHomepage";

async function fetchRestaurantMeta(subdomain: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/restaurants/${subdomain}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const subdomain = await getSubdomainFromRequest();
  if (!subdomain) return { title: "VTap" };

  const restaurant = await fetchRestaurantMeta(subdomain);
  if (!restaurant) return { title: "VTap" };

  const title = restaurant.pageTitle || restaurant.name || "VTap";
  const icons: Metadata["icons"] = restaurant.favicon
    ? { icon: restaurant.favicon }
    : undefined;

  return { title, icons };
}

export default async function Home() {
  const subdomain = await getSubdomainFromRequest();

  return subdomain ? (
    <RestaurantTemplate subdomain={subdomain} />
  ) : (
    <VTapHomepage />
  );
}
