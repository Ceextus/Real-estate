import { existsSync } from "node:fs";
import path from "node:path";
import Hero from "@/components/home/Hero";
import PropertiesShowcase from "@/components/home/PropertiesShowcase";
import SiteInspection from "@/components/home/SiteInspection";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import EstateFeatures from "@/components/EstateFeatures";
import { createStaticClient } from "@/utils/supabase/static";

// Re-fetch listings at most every 5 minutes; the page itself stays static.
export const revalidate = 300;

// Drop a photo at this path and the inspection section uses it automatically.
const VEHICLE_IMAGE = "/images/site.jpg";
const FALLBACK_IMAGE = "/images/modern-architecture-building-with-geometric-facade-clean-lines-clear-sky.jpg";

async function getHomeData() {
  const supabase = createStaticClient();
  const [{ data: properties }, { data: settings }] = await Promise.all([
    supabase
      .from("properties")
      .select("title, slug, location, price, type, property_type, status, beds, size, image, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("site_settings").select("contact").eq("id", 1).single(),
  ]);
  return { properties: properties ?? [], contact: settings?.contact ?? {} };
}

export default async function Home() {
  const { properties, contact } = await getHomeData();
  const hasVehicle = existsSync(path.join(process.cwd(), "public", VEHICLE_IMAGE));
  // "15 Hamza Abdulahi Cl, Asokoro, Aso 900110, …" → "Head office, 15 Hamza Abdulahi Cl, Asokoro"
  const pickup = contact.address
    ? `Head office, ${contact.address.split(",").slice(0, 2).join(",").trim()}`
    : null;

  return (
    <main className="min-h-screen relative overflow-x-clip bg-canvas">
      <Hero />

      <PropertiesShowcase properties={properties} />

      <SiteInspection
        image={hasVehicle ? VEHICLE_IMAGE : FALLBACK_IMAGE}
        isVehicle={hasVehicle}
        phone={contact.phone1}
        address={pickup}
      />

      <AboutUs />

      {/* Services Section */}
      <Services />

      {/* Estate facilities + closing promise banner */}
      <EstateFeatures />
    </main>
  );
}
