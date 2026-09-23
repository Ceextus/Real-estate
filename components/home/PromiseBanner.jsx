"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";

// Three photos start stacked in the centre, then fan out to the right when the banner scrolls in.
const photos = [
  {
    src: "/images/office-exterior.jpg",
    alt: "Andreams Global Properties office building",
    className: "object-center",
    to: { x: "-58%", y: "6%", rotate: -6, scale: 0.84 },
  },
  {
    src: "/images/team.jpg",
    alt: "The Andreams Homes team",
    className: "object-center",
    to: { x: "-4%", y: "1%", rotate: -1.5, scale: 0.92 },
  },
  {
    src: "/images/key-handover.jpg",
    alt: "The Andreams chairman presenting a branded gift to a guest",
    className: "object-[65%_center]",
    to: { x: "48%", y: "-4%", rotate: 3, scale: 1.04 },
  },
];

export default function PromiseBanner() {
  const reduce = useReducedMotion();

  return (
    <Reveal className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-12 overflow-hidden border border-line bg-white">
      <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Our commitment
        </p>
        <WordReveal
          as="blockquote"
          stagger={0.05}
          lines={[
            {
              text: "“We will never stop delivering the highest quality lands and properties with secure titles.”",
              accent: ["secure", "titles.”"],
            },
          ]}
          className="mt-5 font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight text-primary"
        />
        <Reveal delay={0.3} as="p" className="mt-5 text-sm text-ink-soft">
          — Andreams Global Properties Ltd.
        </Reveal>
        <Reveal delay={0.4} className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
          >
            Explore properties
            <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center border border-primary/20 px-5 py-3 text-sm text-primary transition-colors duration-300 hover:border-primary/50"
          >
            Get consultation
          </Link>
        </Reveal>
      </div>

      {/* Fanned photo stack */}
      <motion.div
        initial="stacked"
        whileInView="fanned"
        viewport={{ once: true, amount: 0.5 }}
        className="relative lg:col-span-5 min-h-80 sm:min-h-96 bg-surface/60 flex items-center justify-center"
      >
        {photos.map((p, i) => (
          <motion.div
            key={p.src}
            variants={{
              stacked: reduce
                ? { opacity: 0 }
                : { opacity: 0, x: "0%", y: "10%", rotate: 0, scale: 0.8, filter: "blur(10px)" },
              fanned: {
                opacity: 1,
                ...(reduce ? {} : { ...p.to, filter: "blur(0px)" }),
                transition: { duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE },
              },
            }}
            style={{ zIndex: i + 1 }}
            className="absolute h-48 w-36 sm:h-72 sm:w-52 overflow-hidden border-4 border-white shadow-[0_24px_50px_-20px_rgba(11,29,58,0.45)]"
          >
            <Image src={p.src} alt={p.alt} fill sizes="220px" className={`object-cover ${p.className}`} />
          </motion.div>
        ))}
      </motion.div>
    </Reveal>
  );
}
