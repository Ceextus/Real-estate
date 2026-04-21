import { createClient } from "@/utils/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import PropertiesClient from "./PropertiesClient";

export const metadata = {
  title: "Properties for Sale in Lagos — Luxury Homes & Land",
  description:
    "Browse exclusive luxury properties for sale in Lagos, Nigeria. Villas, apartments, duplexes, and serviced land in Banana Island, Ikoyi, Lekki & more — with verified titles.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Properties for Sale in Lagos — Luxury Homes & Land",
    description:
      "Explore Andreams Homes' curated portfolio of premium properties across Lagos. Smart homes, off-plan investments, and move-in-ready residences.",
    url: "/properties",
  },
};

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return <PropertiesClient properties={properties || []} />;
}
