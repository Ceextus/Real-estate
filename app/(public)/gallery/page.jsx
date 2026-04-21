import { createClient } from "@/utils/supabase/server";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery — Luxury Property Photos & Interiors",
  description:
    "Explore stunning photos of Andreams Homes luxury properties — exteriors, interiors, smart home features, and premium amenities across Lagos, Nigeria.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery — Luxury Property Photos | Andreams Homes",
    description:
      "Browse our curated collection of luxury property images — world-class interiors, exteriors, and premium amenities.",
    url: "/gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Luxury Property Photos | Andreams Homes",
    description:
      "Browse our curated collection of luxury property images across Lagos, Nigeria.",
  },
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  return <GalleryClient images={images || []} />;
}
