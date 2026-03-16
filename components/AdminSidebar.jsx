"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  HiOutlineHome, 
  HiOutlineOfficeBuilding, 
  HiOutlineUsers, 
  HiOutlinePhotograph, 
  HiOutlineChatAlt2, 
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineCalendar
} from "react-icons/hi";
import { GoHomeFill } from "react-icons/go";
import { createClient } from "@/utils/supabase/client";

const navLinks = [
  { name: "Dashboard", href: "/admin", icon: HiOutlineHome, exact: true },
  { name: "Properties", href: "/admin/properties", icon: HiOutlineOfficeBuilding },
  { name: "Team Members", href: "/admin/team", icon: HiOutlineUsers },
  { name: "Gallery", href: "/admin/gallery", icon: HiOutlinePhotograph },
  { name: "Messages", href: "/admin/messages", icon: HiOutlineChatAlt2 },
  { name: "Inspections", href: "/admin/inspections", icon: HiOutlineCalendar },
  { name: "Settings", href: "/admin/settings", icon: HiOutlineCog },
];

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
    <aside className="w-64 bg-primary text-white flex flex-col min-h-screen border-r border-white/10 shadow-xl z-50">
      {/* Sidebar Header / Logo */}
      <div className=" bg-white h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <Link href="/admin" className="flex items-center" onClick={onMobileClick}>
          <div className="relative h-22 w-48 -ml-2 ">
            <Image 
              src="/logo.png" 
              alt="Andream Homes Logo" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        {/* Mobile Close Button (only visible on mobile via parent styling usually, but we can manage here too) */}
        <button onClick={onMobileClick} className="lg:hidden text-primary hover:text-primary/35 p-2 text-2xl">
          &times;
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = link.exact 
            ? pathname === link.href 
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onMobileClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-accent text-white shadow-md font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon className={`text-xl ${isActive ? "text-white" : "text-white/50"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all duration-300"
        >
          <HiOutlineHome className="text-xl" />
          <span>Back to Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
        >
          <HiOutlineLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
