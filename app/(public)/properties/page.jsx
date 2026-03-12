import { createClient } from "@/utils/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PropertiesClient properties={properties || []} />
  );
}
