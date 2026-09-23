"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";
import { tidy } from "@/lib/format";

const pad = (n) => String(n).padStart(2, "0");

export default function TeamSection({ members }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  if (members.length === 0) return null;
  const member = members[active];

  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(10px)" },
      };

  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The Core Team
            </Reveal>
            <WordReveal
              as="h2"
              lines={["Meet the minds behind", { text: "Andreams Homes", accent: ["Homes"] }]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-white"
            />
          </div>
        </div>

        {/* Desktop: names | portrait | bio */}
        <Reveal className="mt-16 hidden lg:grid grid-cols-12 gap-10">
          <ol className="col-span-5 border-t border-white/10">
            {members.map((m, i) => (
              <li key={m.id ?? i} className="border-b border-white/10">
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="group flex w-full items-baseline gap-5 py-6 text-left"
                >
                  <span className={`text-[11px] tabular-nums transition-colors duration-500 ${i === active ? "text-accent" : "text-white/30"}`}>
                    {pad(i + 1)}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block font-display font-bold text-3xl leading-tight transition-colors duration-500 ${
                        i === active ? "text-white" : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {tidy(m.name)}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-white/50">
                      {tidy(m.role)}
                    </span>
                  </span>
                  <span
                    className={`h-px bg-accent transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      i === active ? "w-10" : "w-0"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>

          <div className="col-span-3 relative aspect-3/4 overflow-hidden bg-primary-light">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={active} {...swap} transition={{ duration: 0.6, ease: EASE }} className="absolute inset-0">
                {member.image && (
                  <Image src={member.image} alt={tidy(member.name)} fill sizes="320px" className="object-cover" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="col-span-4 flex flex-col justify-end">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} {...swap} transition={{ duration: 0.45, ease: EASE }}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">{tidy(member.role)}</p>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/70">
                  {member.bio?.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Mobile & tablet: stacked cards */}
        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:hidden">
          {members.map((m, i) => (
            <Reveal as="li" key={m.id ?? i} delay={(i % 2) * 0.1}>
              <div className="relative aspect-4/5 overflow-hidden bg-primary-light">
                {m.image && <Image src={m.image} alt={tidy(m.name)} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />}
              </div>
              <p className="mt-5 font-display font-bold text-2xl text-white">{tidy(m.name)}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-accent">{tidy(m.role)}</p>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/70">
                {m.bio?.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
