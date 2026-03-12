import { createClient } from "@/utils/supabase/server";
import AboutClient from "./AboutClient";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .eq("status", "Active")
    .order("sort_order", { ascending: true });

  return <AboutClient teamMembers={teamMembers || []} />;
}
