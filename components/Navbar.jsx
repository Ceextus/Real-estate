"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { BsArrowUpRight } from "react-icons/bs";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { EASE } from "@/components/motion/Reveal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Properties", href: "/properties" },
  // { name: "Blog", href: "/blog" }, // Blog hidden for now
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
];

// Items blur in one after another when the page first loads.
const intro = {
  hidden: { opacity: 0, y: -10, filter: "blur(8px)" },
  shown: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.1 + i * 0.05, ease: EASE },
  }),
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Solid background once scrolled; slide away when scrolling down, return when scrolling up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > 240 && y > prev && !isOpen);
  });

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
          scrolled || isOpen
            ? "bg-canvas/85 backdrop-blur-xl border-line"
            : "bg-canvas border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Logo + links, left aligned like the reference */}
          <div className="flex items-center gap-10">
            <motion.div custom={0} variants={intro} initial="hidden" animate="shown">
              <Link href="/" className="relative block w-14 h-14" onClick={() => setIsOpen(false)}>
                <Image
                  src="/logo.png"
                  alt="Andreams Homes Logo"
                  fill
                  sizes="56px"
                  className="object-contain object-left"
                  priority
                />
              </Link>
            </motion.div>

            <ul className="hidden lg:flex items-center gap-7">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  custom={i + 1}
                  variants={intro}
                  initial="hidden"
                  animate="shown"
                >
                  <Link
                    href={link.href}
                    className={`group relative text-[13px] tracking-wide transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-ink-soft hover:text-primary"
                    }`}
                  >
                    {link.name}
                    {/* Underline grows from the left on hover, stays on the active page */}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right actions */}
          <motion.div
            custom={navLinks.length + 1}
            variants={intro}
            initial="hidden"
            animate="shown"
            className="hidden lg:flex items-center gap-5"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border border-primary/15 px-4 py-2 text-[13px] text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary"
            >
              Get started
              <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            custom={1}
            variants={intro}
            initial="hidden"
            animate="shown"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="lg:hidden p-2 -mr-2 text-primary"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {isOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt4 className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile menu: full-height sheet with large display-type links */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="lg:hidden fixed inset-0 top-20 z-60 bg-canvas/95 backdrop-blur-xl px-4 sm:px-6 pt-8 pb-10 flex flex-col"
          >
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.05 + i * 0.05, ease: EASE }}
                  className="border-b border-line"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 font-display text-4xl ${
                      isActive(link.href) ? "text-accent" : "text-primary"
                    }`}
                  >
                    {link.name}
                    <BsArrowUpRight className="text-base text-ink-soft" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="mt-auto"
            >
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-primary py-4 text-center text-sm font-medium text-white"
              >
                Get started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
