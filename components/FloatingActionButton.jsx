"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BsCalendarEvent } from "react-icons/bs";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Hide on admin routes
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Show after scrolling down a bit
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 1,
          }}
          className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
        >
          {/* Subtle pulse ring behind the button */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(224, 155, 107, 0.4)",
                "0 0 0 20px rgba(224, 155, 107, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full"
          />

          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-[#11241a] text-white px-5 py-4 sm:px-6 sm:py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-accent/30 group relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
              
              <div className="relative z-10 bg-accent text-white p-2 sm:p-2.5 rounded-full flex items-center justify-center -ml-2 sm:-ml-3 shadow-inner">
                <BsCalendarEvent className="text-sm sm:text-base" />
              </div>
              
              <span className="relative z-10 font-bold text-xs sm:text-sm tracking-wider uppercase whitespace-nowrap">
                Book Inspection
              </span>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
