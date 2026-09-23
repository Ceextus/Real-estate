"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenuAlt2, HiOutlineExternalLink } from "react-icons/hi";
import AdminSidebar from "@/components/AdminSidebar";
import { ToastProvider } from "@/components/Toast";

export default function AdminLayoutClient({ children, email }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initial = (email?.[0] ?? "A").toUpperCase();

  return (
    <ToastProvider>
      <div className="flex min-h-screen overflow-x-clip bg-canvas font-sans">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar: drawer on mobile, pinned on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onMobileClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="-ml-2 p-2 text-primary lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <HiMenuAlt2 className="text-2xl" />
              </button>
              {/* The page heading names the section; the bar just orients (no repeated title) */}
              <p className="truncate text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                Andreams Homes <span className="text-accent">·</span> Admin portal
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 border border-primary/15 px-3 py-2 text-[13px] text-primary transition-colors hover:border-primary/40"
              >
                View site
                <HiOutlineExternalLink className="text-sm" />
              </Link>
              <div className="flex items-center gap-2.5">
                <span className="hidden md:block max-w-56 truncate text-[13px] text-ink-soft">{email}</span>
                <span className="flex h-9 w-9 items-center justify-center bg-primary text-sm font-medium text-white" aria-hidden>
                  {initial}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
