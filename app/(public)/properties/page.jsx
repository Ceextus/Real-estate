import { createClient } from "@/utils/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import PropertiesClient from "./PropertiesClient";

export const metadata = {
  title: "Properties for Sale in Abuja & Lagos — Homes, Plots & Land",
  description:
    "Browse affordable properties for sale in Abuja and Lagos, Nigeria. Duplexes, bungalows, serviced plots, and land in Karu, Kurudu, Lugbe, Jikwoyi, Asokoro & more — with verified C of O titles.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Properties for Sale in Abuja & Lagos — Homes, Plots & Land",
    description:
      "Explore Andreams Homes' portfolio of affordable properties across Abuja FCT and Lagos. Serviced plots, duplexes, bungalows, and land investments.",
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
