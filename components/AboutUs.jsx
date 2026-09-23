"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { CountUp, MiniBars } from "@/components/motion/CountUp";

const stats = [
  {
    value: 9,
    suffix: "+",
    label: "Projects Delivered",
    bars: [0.3, 0.45, 0.35, 0.5, 0.4, 0.55, 0.5, 0.65, 0.6, 0.75, 0.7, 0.9],
  },
  {
    value: 13,
    suffix: "+",
    label: "Years of Experience",
    bars: [0.2, 0.25, 0.3, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.95],
  },
  {
    value: 300,
    suffix: "+",
    label: "Happy Clients",
    bars: [0.15, 0.5, 0.3, 0.2, 0.6, 0.35, 0.45, 0.25, 0.7, 0.4, 0.55, 0.85],
  },
];

export default function AboutUs() {
  const frameRef = useRef(null);
  const reduce = useReducedMotion();

  // The video frame opens from an inset card to full width as it scrolls up to centre.
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "center center"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(8% 5% 8% 5%)", "inset(0% 0% 0% 0%)"]
  );
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <section className="relative bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: headline left, supporting copy right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About Us
            </Reveal>
            <WordReveal
              as="h2"
              lines={[
                { text: "We've found luxury homes", accent: ["luxury"] },
                "for clients for a decade.",
              ]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-primary"
            />
          </div>

          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">
              ANDREAM GLOBAL PROPERTIES LTD will become a specialist in turning
              slums into beautiful cities and turning a run-down and dilapidated
              building into a master piece.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
            >
              Get started
              <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Story + stat cards */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <p className="text-base leading-relaxed text-ink-soft">
              Founded in Abuja FCT in the year 2013 and started full operation in
              the year 2015, ANDREAMS GLOBAL PROPERTIES LTD, is a property
              development company that is based in Abuja. Our aim of starting this
              business is to work in tandem with the government of Nigeria and
              private and individuals to deliver affordable homes and properties
              for all classes of people in Nigeria.
            </p>
          </Reveal>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.1}
                className="flex flex-col justify-between border border-line bg-white p-5 min-h-44"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                  {stat.label}
                </p>
                <div>
                  <p className="mt-6 font-display font-bold text-5xl leading-none text-primary">
                    <CountUp value={stat.value} delay={0.2 + i * 0.1} />
                    <span className="text-accent">{stat.suffix}</span>
                  </p>
                  <MiniBars
                    bars={stat.bars}
                    highlight={stat.bars.length - 1}
                    delay={0.3 + i * 0.1}
                    className="mt-5"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Video frame */}
        <motion.div
          ref={frameRef}
          style={reduce ? undefined : { clipPath }}
          className="relative mt-20 md:mt-28 h-[60vh] min-h-105 max-h-180 w-full overflow-hidden bg-surface"
        >
          <motion.video
            style={reduce ? undefined : { scale: videoScale }}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/images/site.mp4" type="video/mp4" />
          </motion.video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />

          {/* Padding stays inside the frame's starting inset so the caption is never cropped */}
          <div className="absolute inset-x-0 bottom-0 px-[7%] pb-[10%] sm:pb-[7%] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <WordReveal
              as="p"
              lines={["Dream House"]}
              className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-none text-white"
            />
            <Reveal delay={0.3} className="text-[11px] uppercase tracking-[0.18em] text-white/75">
              Abuja · Since 2013
            </Reveal>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
