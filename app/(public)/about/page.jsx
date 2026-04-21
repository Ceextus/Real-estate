import { createClient } from "@/utils/supabase/server";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Us — Our Mission, Vision & Team",
  description:
    "Meet the team behind Andreams Global Properties Ltd (AGPL) — Abuja's leading real estate developer since 2013. Learn about our mission, vision, and commitment to delivering affordable homes across Nigeria.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Andreams Homes — Our Mission, Vision & Team",
    description:
      "Since 2013, delivering affordable homes and property investments in Abuja FCT and Lagos. Discover our story, core team, and commitment to excellence.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .eq("status", "Active")
    .order("sort_order", { ascending: true });

  return <AboutClient teamMembers={teamMembers || []} />;
}
