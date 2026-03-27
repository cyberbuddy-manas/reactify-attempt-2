import { getSubdomainFromRequest } from "@/lib/subdomain";
import { RestaurantTemplate } from "@/components/RestaurantTemplate";
import { VTapHomepage } from "@/components/VTapHomepage";

export default async function Home() {
  const subdomain = await getSubdomainFromRequest();

  return subdomain ? (
    <RestaurantTemplate subdomain={subdomain} />
  ) : (
    <VTapHomepage />
  );
}
