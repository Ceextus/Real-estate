import Hero from "@/components/home/Hero";
import PropertiesShowcase from "@/components/home/PropertiesShowcase";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import EstateFeatures from "@/components/EstateFeatures";
import { createStaticClient } from "@/utils/supabase/static";

// Re-fetch listings at most every 5 minutes; the page itself stays static.
export const revalidate = 300;

async function getProperties() {
  const { data } = await createStaticClient()
    .from("properties")
    .select("title, slug, location, price, type, property_type, status, beds, size, image, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen relative overflow-x-clip bg-canvas">
      <Hero />

      <PropertiesShowcase properties={properties} />

      <AboutUs />

      {/* Services Section */}
      <Services />

      {/* Estate facilities + closing promise banner */}
      <EstateFeatures />
    </main>
  );
}
