"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { BsHouseDoor } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Properties", href: "/properties" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
  { name: "Login", href: "/admin" },
  
  // { name: "Rent", href: "/rent" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ${scrolled ? "pt-4 px-4" : ""}`}
    >
      {/* Background fill to prevent white gap */}
      <div
        className={`absolute top-0 left-0 right-0 h-8 bg-primary transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"} pointer-events-none`}
      />

      <motion.nav
        initial={{ y: -100, width: "100%", borderRadius: 0 }}
        animate={{
          y: 0,
          width: scrolled ? "70%" : "100%",
          borderRadius: scrolled ? 9999 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto transition-colors duration-500 overflow-hidden w-full ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/10"
            : "bg-primary border-transparent shadow-md"
        }`}
      >
        <div className="px-4 md:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-500 ${scrolled ? "h-16" : "h-20"}`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group relative z-50"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative w-32 h-10 sm:w-40 sm:h-12"
              >
                <Image
                  src="/logo.png"
                  alt="Andream Homes Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Subtle Pill */}
            <div
              className={`hidden md:flex rounded-full p-1.5 items-center relative transition-all duration-500 ${scrolled ? "bg-primary/5 border border-primary/10" : "bg-white/10 backdrop-blur-md"}`}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative z-10 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-full -z-10 shadow-sm ${scrolled ? "bg-primary" : "bg-white/20"}`}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                        isActive
                          ? "text-white"
                          : scrolled
                            ? "text-primary/70 group-hover:text-primary"
                            : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {link.name}
                      {["Rent"].includes(link.name) && (
                        <motion.span
                          className="text-[10px] opacity-70 mt-[2px] inline-block"
                          whileHover={{ y: 2 }}
                        >
                          ▼
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg border border-transparent ${scrolled ? "bg-primary text-white hover:bg-accent" : "bg-accent text-white hover:bg-white hover:text-accent"}`}
                >
                  Get started
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center z-50">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: scrolled
                    ? "rgba(29,71,52,0.1)"
                    : "rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full focus:outline-none transition-colors duration-300 shadow-sm ${scrolled ? "text-primary bg-primary/5 border border-primary/10" : "text-white bg-white/5 border border-white/20"}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? (
                      <HiX className="h-5 w-5" />
                    ) : (
                      <HiMenu className="h-5 w-5" />
                                                                          )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-24 left-4 right-4 bg-primary/95 backdrop-blur-2xl border border-primary-light/30 rounded-3xl p-6 shadow-2xl pointer-events-auto"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-xl font-medium transition-all duration-300 
                        ${
                          isActive
                            ? "bg-white/10 text-accent border border-white/10"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-6 mt-2 border-t border-white/10"
              >
                <Link
                  href="/contact"
                  className="block w-full py-4 bg-accent text-white hover:bg-white hover:text-accent border border-transparent hover:border-accent rounded-2xl text-lg font-bold text-center shadow-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Get started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
