"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlinePhotograph,
  HiOutlineChatAlt2,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineCalendar,
  HiOutlineNewspaper,
  HiOutlineExternalLink,
  HiX,
} from "react-icons/hi";
import { createClient } from "@/utils/supabase/client";
import { EASE } from "@/components/motion/Reveal";

export const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: HiOutlineHome, exact: true },
  { name: "Properties", href: "/admin/properties", icon: HiOutlineOfficeBuilding },
  { name: "Blog Posts", href: "/admin/blog", icon: HiOutlineNewspaper },
  { name: "Team Members", href: "/admin/team", icon: HiOutlineUsers },
  { name: "Gallery", href: "/admin/gallery", icon: HiOutlinePhotograph },
  { name: "Messages", href: "/admin/messages", icon: HiOutlineChatAlt2 },
  { name: "Inspections", href: "/admin/inspections", icon: HiOutlineCalendar },
  { name: "Settings", href: "/admin/settings", icon: HiOutlineCog },
];

export const isActiveLink = (pathname, link) =>
  link.exact ? pathname === link.href : pathname?.startsWith(link.href);

export default function AdminSidebar({ onMobileClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-primary text-white">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
        <Link href="/admin" onClick={onMobileClick} className="flex items-center gap-3">
          <span className="relative block h-11 w-11">
            <Image src="/logo.png" alt="Andreams Homes Logo" fill sizes="44px" className="object-contain" priority />
          </span>
          <span className="leading-tight">
            <span className="block font-display font-bold text-lg">Andreams</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/50">Admin</span>
          </span>
        </Link>
        <button onClick={onMobileClick} aria-label="Close menu" className="p-2 text-white/60 hover:text-white lg:hidden">
          <HiX className="text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="px-3 pb-3 text-[10px] uppercase tracking-[0.18em] text-white/35">Manage</p>
        <ul className="space-y-0.5">
          {adminLinks.map((link) => {
            const active = isActiveLink(pathname, link);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={onMobileClick}
                  className={`relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-300 ${
                    active ? "bg-white/8 text-white" : "text-white/55 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-nav-marker"
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-y-0 left-0 w-0.5 bg-accent"
                    />
                  )}
                  <link.icon className={`text-lg ${active ? "text-accent" : "text-white/40"}`} />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="shrink-0 space-y-0.5 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/4 hover:text-white"
        >
          <HiOutlineExternalLink className="text-lg text-white/40" />
          Back to website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-red-500/15 hover:text-red-200"
        >
          <HiOutlineLogout className="text-lg text-white/40" />
          Logout
        </button>
      </div>
    </aside>
  );
}
