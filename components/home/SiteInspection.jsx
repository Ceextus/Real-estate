"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BsArrowUpRight, BsTelephone, BsCalendarWeek, BsClock, BsGeoAlt } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";
import { displayPhone, telPhone } from "@/lib/format";

// Inspection schedule — edit here if the days or departure time change.
const SCHEDULE = { days: "Monday – Saturday", time: "Departs 9:00 AM" };

export default function SiteInspection({ image, isVehicle, phone, address }) {
  const reduce = useReducedMotion();
  const details = [
    { icon: BsCalendarWeek, label: "Days", value: SCHEDULE.days },
    { icon: BsClock, label: "Departure", value: SCHEDULE.time },
    address && { icon: BsGeoAlt, label: "Pickup point", value: address },
  ].filter(Boolean);

  return (
    <section className="bg-canvas pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="relative grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-primary">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-6 p-8 sm:p-12 lg:p-14">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Site inspection
            </p>
            <WordReveal
              as="h2"
              lines={["See it for yourself,", { text: "every working day.", accent: ["every", "working", "day."] }]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.02] tracking-tight text-white"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
                Join our site inspections every weekday and Saturday. We take you
                from our head office to the estates — walk the grounds, see the
                vision, and find the plot or home that fits you.
              </p>
            </Reveal>

            <ul className="mt-10 border-t border-white/10">
              {details.map((d, i) => (
                <Reveal as="li" key={d.label} delay={0.2 + i * 0.08} y={12} className="flex items-start gap-4 border-b border-white/10 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-accent">
                    <d.icon className="text-sm" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">{d.label}</span>
                    <span className="mt-1 block text-base text-white">{d.value}</span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.45} className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm text-primary transition-colors duration-300 hover:bg-secondary"
              >
                Book an inspection
                <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              {phone && (
                <a
                  href={`tel:${telPhone(phone)}`}
                  className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm text-white transition-colors duration-300 hover:border-white/50"
                >
                  <BsTelephone className="text-xs" />
                  {displayPhone(phone)}
                </a>
              )}
            </Reveal>
          </div>

          {/* Visual: the photo glides in like a vehicle pulling up, over a moving road line */}
          <div className="relative lg:col-span-6 min-h-80 sm:min-h-105 lg:min-h-full overflow-hidden">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: "12%", filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: "0%", filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={image}
                alt={isVehicle ? "Andreams Homes site inspection vehicle" : "Andreams Homes development"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover ${isVehicle ? "object-center" : "object-[70%_60%]"}`}
              />
            </motion.div>
            {/* Blend the photo into the navy panel on large screens */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/70 via-transparent to-transparent lg:bg-linear-to-r lg:from-primary lg:via-primary/10" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-primary">
                  {SCHEDULE.days.replace(" – ", "–")} · 9:00 AM
                </span>
              </div>
              {/* Road line */}
              <div className="mt-5 h-0.5 w-full overflow-hidden bg-white/15">
                <div className="h-full w-[200%] animate-road bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_28px,transparent_28px_56px)]" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
