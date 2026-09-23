"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";

// Each service belongs to one side of the promise: we build, sell, manage and value properties.
const GROUPS = {
  build: { label: "We build" },
  sell: { label: "We sell & lease" },
  manage: { label: "We manage & advise" },
};

const servicesList = [
  { title: "Developing Properties for Clients", group: "build" },
  { title: "Leasing of Properties", group: "sell" },
  { title: "Renting of Properties", group: "sell" },
  { title: "Selling of Fully Furnished Properties", group: "sell" },
  { title: "Selling of Landed Properties", group: "sell" },
  { title: "Leasing of Bare Land", group: "sell" },
  { title: "Property & Facility Management", group: "manage" },
  { title: "Property Make Over Services", group: "build" },
  { title: "Real Estate Consultancy", group: "manage" },
  { title: "Advisory Services", group: "manage" },
];

const pad = (n) => String(n).padStart(2, "0");

export default function Services() {
  return (
    <section className="relative bg-primary py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Projects &amp; Services
            </Reveal>
            <WordReveal
              as="h2"
              lines={[
                "We build, sell, manage",
                { text: "and value properties.", accent: ["value"] },
              ]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-white"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              ANDREAMS GLOBAL PROPERTIES LTD is involved in the core real estate
              business. From property development and management to consultancy
              and advisory services, we deliver end-to-end real estate solutions
              for all classes of people in Nigeria.
            </p>
          </Reveal>
        </div>
      </div>

      <PinnedServices />
      <StackedServices />
    </section>
  );
}

/* Desktop: the panel pins while scrolling steps through each service. */
function PinnedServices() {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const inView = useInView(trackRef, { margin: "200px 0px" });
  const n = servicesList.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))));
  });

  // The drone video is large, so only load and play it once the section is near.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  // Clicking a service in the list scrolls to its step.
  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * travel, behavior: "smooth" });
  };

  const service = servicesList[active];
  const swap = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -16, filter: "blur(8px)" },
      };

  return (
    <div
      ref={trackRef}
      style={{ "--track-h": `${n * 34 + 100}vh` }}
      className="relative hidden lg:block mt-14 h-(--track-h)"
    >
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] items-center">
        <Reveal className="max-w-7xl w-full mx-auto px-8">
          <div className="grid grid-cols-12 bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] h-[min(640px,78vh)]">
            {/* Left: active service + list */}
            <div className="col-span-5 flex flex-col p-10">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                <span>{GROUPS[service.group].label}</span>
                <span className="tabular-nums">
                  <span className="text-primary">{pad(active + 1)}</span> / {pad(n)}
                </span>
              </div>

              <div className="relative mt-8 min-h-36">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={active}
                    {...swap}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="font-display font-bold text-4xl xl:text-[2.75rem] leading-[1.05] text-primary"
                  >
                    {service.title}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <Link
                href="/contact"
                className="group mt-4 inline-flex w-fit items-center gap-2 border border-primary/20 px-4 py-2.5 text-[13px] text-primary transition-colors duration-300 hover:bg-primary hover:text-white hover:border-primary"
              >
                Get consultation
                <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <ol className="mt-auto grid grid-flow-col grid-rows-5 gap-x-6 gap-y-1.5 pt-8">
                {servicesList.map((s, i) => (
                  <li key={s.title}>
                    <button
                      onClick={() => goTo(i)}
                      className={`flex w-full items-center gap-2 text-left text-xs leading-snug transition-colors duration-300 ${
                        i === active ? "text-primary" : "text-ink-soft/60 hover:text-primary"
                      }`}
                    >
                      <span
                        className={`h-1 w-1 shrink-0 rounded-full transition-colors duration-300 ${
                          i === active ? "bg-accent" : "bg-transparent"
                        }`}
                      />
                      <span className="line-clamp-1">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>

              {/* Scroll progress through the services */}
              <div className="mt-6 h-px w-full bg-line">
                <motion.div
                  style={{ scaleX: scrollYProgress }}
                  className="h-full origin-left bg-accent"
                />
              </div>
            </div>

            {/* Right: media for the active group */}
            <div className="relative col-span-7 overflow-hidden bg-surface">
              <MediaLayer show={service.group === "build"}>
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover"
                >
                  <source src="/images/rs.mp4" type="video/mp4" />
                </video>
              </MediaLayer>
              <MediaLayer show={service.group === "sell"}>
                <Image
                  src="/images/modern-architecture-building-with-geometric-facade-clean-lines-clear-sky.jpg"
                  alt="Modern residential building facade"
                  fill
                  sizes="60vw"
                  className="object-cover object-[80%_70%]"
                />
              </MediaLayer>
              <MediaLayer show={service.group === "manage"}>
                <Image
                  src="/images/team.jpg"
                  alt="The Andreams Homes team"
                  fill
                  sizes="60vw"
                  className="object-cover"
                />
              </MediaLayer>

              {/* Inset card, like the floor-plan thumbnail in the reference */}
              <div className="absolute bottom-5 right-5 max-w-60 border border-line bg-canvas p-4 shadow-lg shadow-primary/10">
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent">Our promise</p>
                <p className="mt-2 text-sm leading-snug text-primary">
                  We build, sell, manage, and value properties — that&apos;s our
                  promise to every client.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function MediaLayer({ show, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={
        reduce
          ? { opacity: show ? 1 : 0 }
          : { opacity: show ? 1 : 0, scale: show ? 1 : 1.06 }
      }
      transition={{ duration: 0.9, ease: EASE }}
      className="absolute inset-0"
      aria-hidden={!show}
    >
      {children}
    </motion.div>
  );
}

/* Mobile & tablet: a simple numbered list that blurs in row by row. */
function StackedServices() {
  return (
    <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 mt-10">
      <Reveal className="relative aspect-4/3 overflow-hidden bg-primary-light">
        <Image
          src="/images/team.jpg"
          alt="The Andreams Homes team"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Reveal>
      <ol className="mt-6 border-t border-white/10">
        {servicesList.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            y={16}
            delay={(i % 4) * 0.05}
            className="flex items-baseline gap-4 border-b border-white/10 py-4"
          >
            <span className="text-[11px] tabular-nums text-accent">{pad(i + 1)}</span>
            <div>
              <p className="text-base text-white">{s.title}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/50">
                {GROUPS[s.group].label}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
      <Link
        href="/contact"
        className="group mt-6 inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm text-primary"
      >
        Get consultation
        <BsArrowUpRight className="text-xs" />
      </Link>
    </div>
  );
}
