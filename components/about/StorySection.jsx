"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal, WordReveal } from "@/components/motion/Reveal";

const milestones = [
  { mark: "2013", text: "Founded in Abuja FCT" },
  { mark: "2015", text: "Started full operation" },
  { mark: "HQ", text: "Head office in Abuja FCT, branch office in Anyigba, Kogi State" },
  { mark: "Next", text: "One of the largest owners, managers and developers of first-class properties in Nigeria" },
];

const story = [
  "Founded in Abuja FCT in the year 2013 and started full operation in the year 2015, ANDREAMS GLOBAL PROPERTIES LTD, is a property development company that is based in Abuja. Our aim of starting this business is to work in tandem with the government of Nigeria and private and individuals to deliver affordable homes and properties for all classes of people in Nigeria. Our Head Office is located in Abuja FCT with a branch office in Anyigba kogi state.",
  "ANDREAMS GLOBAL PROPERTIES COMPANY is a self-administered and a self-managed real estate investment trust (REIT). We will work towards becoming one of the largest owners, managers, and developers of first-class properties (accommodations, public buildings and office properties) in Nigeria.",
  "We are quite aware that property development business requires a huge capital base, which is why we have perfect plans for steady flow of cash from private investors who are interested in working with us. We can confidently say that we have a robust financial standing and we are ready to take on any property development deal that comes our way.",
  "As part of our plans to make our customers our number one priority and to become the leading property development company in Nigeria, we have perfected plans to work with our clients to deliver projects that can favorably compete with the best in the industry, at an affordable and reasonable price within the stipulated completion date barring any unforeseen circumstance and also to generate great value from any property that we manage (both for our clients and for the company).",
  "ANDREAM GLOBAL PROPERTIES LTD COMPANY will become a specialist in turning slums into beautiful cities and turning a run-down and dilapidated building into a master piece. And that hopefully will be our brand and signature.",
  "ANDREAMS GLOBAL PROPERTIES LTD COMPANY is majorly owned by Andrew Adama and family. Andrew Adama is a property guru that has worked with top Real Estate Companies in FCT Abuja for many years; prior to starting his own business. Other investors with same investment ideology whose name cannot be mentioned here for obvious reasons are also part owners of the business.",
];

// A paragraph that brightens from faint to full ink as it scrolls up into the reading zone.
function ReadingParagraph({ children, first }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 50%"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 1]);

  return (
    <motion.p
      ref={ref}
      style={reduce ? undefined : { opacity }}
      className={first ? "text-xl sm:text-2xl leading-relaxed text-primary" : "text-base sm:text-lg leading-relaxed text-primary"}
    >
      {children}
    </motion.p>
  );
}

export default function StorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });

  return (
    <section ref={ref} className="bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Pinned timeline */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Our Story
            </Reveal>
            <WordReveal
              as="h2"
              lines={["From Abuja,", { text: "for all of Nigeria.", accent: ["Nigeria."] }]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl leading-[1.02] tracking-tight text-primary"
            />

            <div className="relative mt-10 pl-6">
              {/* Track + fill that follows reading progress */}
              <span className="absolute left-0 top-1 bottom-1 w-px bg-line" />
              <motion.span
                style={{ scaleY: scrollYProgress }}
                className="absolute left-0 top-1 bottom-1 w-px origin-top bg-accent"
              />
              <ol className="space-y-6">
                {milestones.map((m, i) => (
                  <Reveal as="li" key={m.mark} delay={i * 0.08} className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-4 ring-canvas" />
                    <p className="font-display font-bold text-2xl leading-none text-primary">{m.mark}</p>
                    <p className="mt-1.5 max-w-64 text-[13px] leading-relaxed text-ink-soft">{m.text}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Story, read as you scroll */}
        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
          {story.map((p, i) => (
            <ReadingParagraph key={i} first={i === 0}>
              {p}
            </ReadingParagraph>
          ))}
        </div>
      </div>
    </section>
  );
}
