import { createClient } from "@/utils/supabase/server";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Us — Our Mission, Vision & Team",
  description:
    "Meet the team behind Andreams Homes — Lagos's leading luxury real estate developer. Learn about our mission, vision, and 20+ years of delivering premium properties across Nigeria.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Andreams Homes — Our Mission, Vision & Team",
    description:
      "20+ years building premium luxury homes in Lagos. Discover our story, core team, and commitment to excellence in Nigerian real estate.",
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
