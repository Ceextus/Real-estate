"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BsCalendarEvent } from "react-icons/bs";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const pathname = usePathname();

  // Hide on admin routes
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Show after scrolling down a bit
    // Show after scrolling down a bit, and check if at bottom
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
      
      // Check if we are near the bottom of the page to avoid blocking footer
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollPosition >= bodyHeight - 150); // 150px threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  // On a property page, jump to its booking form instead of the listings.
  const onDetail = /^\/properties\/[^/]+/.test(pathname ?? "");
  const href = onDetail ? "#book" : "/properties";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
        >
          <motion.div
            animate={{ y: isAtBottom ? -80 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={href}
              className="group flex items-center gap-2.5 bg-primary ring-1 ring-white/15 py-3 pl-3 pr-4 text-white shadow-[0_14px_30px_-12px_rgba(11,29,58,0.55)] transition-colors duration-300 hover:bg-primary-light"
            >
              <span className="flex h-7 w-7 items-center justify-center bg-accent">
                <BsCalendarEvent className="text-xs" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] whitespace-nowrap">
                Book inspection
              </span>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
