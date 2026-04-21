import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin | Andreams Homes",
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminLayoutClient email={user.email}>{children}</AdminLayoutClient>;
}
