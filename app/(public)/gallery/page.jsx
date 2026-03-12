import { createClient } from "@/utils/supabase/server";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery | Andream Homes",
  description: "Explore our stunning collection of luxury properties — exteriors, interiors, and premium amenities.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  return <GalleryClient images={images || []} />;
}
