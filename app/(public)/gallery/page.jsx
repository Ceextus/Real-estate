import { createClient } from "@/utils/supabase/server";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery — Property Photos & Project Portfolio",
  description:
    "Explore photos of Andreams Homes properties — exteriors, interiors, estate developments, and project sites across Abuja FCT and Lagos, Nigeria.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery — Property Photos & Projects | Andreams Homes",
    description:
      "Browse our collection of property images — estate developments, completed projects, and ongoing construction across Abuja and Lagos.",
    url: "/gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery — Property Photos & Projects | Andreams Homes",
    description:
      "Browse our collection of property images across Abuja and Lagos, Nigeria.",
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
