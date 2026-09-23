"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BsArrowUpRight, BsAward } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import StorySection from "@/components/about/StorySection";
import TeamSection from "@/components/about/TeamSection";
import CommunityGallery from "@/components/about/CommunityGallery";

const stats = [
  { value: 9, label: "Projects" },
  { value: 13, label: "Years of Experience" },
  { value: 13, label: "Professional Roles" },
  { value: 300, label: "Happy Clients" },
];

const roles = [
  "Professional Estate Developer / Valuer",
  "Professional Architects",
  "Professional Civil Engineers",
  "Professional Land Surveyors",
  "Professional Quantity Surveyors",
  "Professional Geophysics",
  "Professional Financial Auditors",
  "Professional Marketers",
  "Professional Administrators",
  "FCDA Directors",
  "Development Control Directors",
  "Professional Builders",
  "Professional Electrical Engineers",
];

const partners = [
  "Brook Fields Company",
  "AEDC",
  "State Height Properties Ltd",
  "EOM Communications Ltd",
  "Nudoral Nigeria Limited",
  "First of First CS Night Ltd",
  "Algamji Investment Ltd",
  "Ayeye and Co",
  "Emmys Dan Ltd",
  "Motion Man Properties Ltd",
  "PHD Army Post Housing Scheme",
  "Elephant Guard Ltd",
];

const programmes = [
  { title: "Yearly Widows Empowerment Programme", description: "Annual programme supporting and empowering widows across our communities." },
  { title: "Orphanage & Widows Empowerment Program", description: "Dedicated support for orphanages and widows through resources and mentorship." },
  { title: "Andream JAMB Empowerment", description: "Supporting students with JAMB registration fees to pursue higher education." },
  { title: "Sports Unites the Youths", description: "Football tournament support programme bringing communities together through sports." },
  { title: "Tournament Support Programme", description: "Sponsoring and organizing sporting events to nurture young talent." },
  { title: "Community School Recognition", description: "Recognized by Community Secondary School students for outstanding community service." },
];

function Eyebrow({ children, dark }) {
  return (
    <Reveal className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/60" : "text-ink-soft"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </Reveal>
  );
}

const headline = "mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-primary";

export default function AboutClient({ teamMembers }) {
  return (
    <main className="bg-canvas overflow-x-clip">
      <AboutHero />
      <StatsStrip />
      <VisionMission />
      <StorySection />
      <HardWork />
      <TeamSection members={teamMembers} />
      <Expertise />
      <Partners />
      <Community />
    </main>
  );
}

/* ——— Hero: headline, then the team photo opens out from the centre like a curtain ——— */
function AboutHero() {
  const bandRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="pt-10 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <Reveal onMount className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            About Us
          </Reveal>
          <WordReveal
            as="h1"
            onMount
            delay={0.2}
            lines={["The Andreams", { text: "Homes Way", accent: ["Way"] }]}
            className="mt-5 font-display font-bold text-[3.25rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight text-primary"
          />
        </div>
        <Reveal onMount delay={0.55} className="lg:col-span-4 lg:pb-3">
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Real estate developers, consultancy and valuers — we build, sell,
            manage and value properties for all classes of people in Nigeria.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
          >
            Let&apos;s talk
            <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>

      <motion.div
        ref={bandRef}
        initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 38% 0% 38%)", opacity: 0.4 }}
        animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
        className="relative mt-12 md:mt-16 h-[58vh] min-h-90 max-h-170 overflow-hidden bg-primary"
      >
        <motion.div style={reduce ? undefined : { y: imageY }} className="absolute inset-x-0 -inset-y-[10%]">
          <Image src="/images/team.jpg" alt="The Andreams Homes team" fill priority sizes="100vw" className="object-cover object-[50%_35%]" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-wrap gap-2">
          {["Est. 2013 · Abuja FCT", "Branch · Anyigba, Kogi State"].map((t, i) => (
            <Reveal key={t} onMount delay={1.4 + i * 0.1} className="bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-primary">
              {t}
            </Reveal>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ——— Stats: large numerals divided by hairlines ——— */
function StatsStrip() {
  return (
    <section className="border-b border-line">
      {/* 1px gaps over a line-coloured backdrop draw the dividers at any column count */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-line">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="bg-canvas px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <p className="font-display font-bold text-5xl md:text-7xl leading-none text-primary">
              <CountUp value={s.value} delay={0.1 + i * 0.1} />
              <span className="text-accent">+</span>
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-ink-soft">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ——— Vision & Mission ——— */
function VisionMission() {
  const items = [
    { n: "01", label: "Our Vision", text: "To deliver affordable and quality homes to all classes of people in Nigeria." },
    { n: "02", label: "Our Mission", text: "Our mission and values is to help people and businesses in Nigeria realize their dreams of owning properties and create wealth." },
  ];
  return (
    <section className="pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((it, i) => (
          <Reveal key={it.n} delay={i * 0.12} className="group relative flex min-h-80 flex-col border border-line bg-white p-8 md:p-10">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em]">
              <span className="text-accent">{it.label}</span>
              <span className="tabular-nums text-ink-soft/70">{it.n}</span>
            </div>
            <p className="mt-auto pt-12 font-display font-bold text-3xl md:text-4xl leading-[1.12] text-primary">
              {it.text}
            </p>
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ——— Hard work meets creativity ——— */
function HardWork() {
  const frameRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <Eyebrow>Our Vision</Eyebrow>
          <WordReveal as="h2" lines={["Hard work meets", { text: "creativity.", accent: ["creativity."] }]} className={headline} />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-soft">
              At Andreams Homes, we believe that true excellence is born at the
              intersection of relentless hard work and boundless creativity. Our
              dedication to pushing the boundaries of what is possible drives us
              to deliver projects that not only meet but exceed expectations.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 flex gap-5 border-l-2 border-accent pl-5">
            <p className="font-display font-bold text-2xl leading-snug text-primary">
              &ldquo;We don&apos;t just build houses; we craft lifetime investments
              and curate lifestyles.&rdquo;
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div ref={frameRef} className="relative aspect-4/5 overflow-hidden bg-primary">
            <motion.video
              style={reduce ? undefined : { y: videoY, scale: 1.2 }}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/images/site.mp4" type="video/mp4" />
            </motion.video>
            <div className="absolute left-4 top-4 bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-primary">
              On site
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ——— Expertise: two tickers running in opposite directions ——— */
function Ticker({ items, reverse }) {
  const row = [...items, ...items];
  return (
    <div className="group flex overflow-hidden border-y border-line bg-white py-5">
      <ul className={`flex shrink-0 items-center gap-8 pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}>
        {row.map((r, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex shrink-0 items-center gap-8 whitespace-nowrap">
            <span className="font-display font-bold text-2xl md:text-3xl text-primary">{r}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Expertise() {
  const half = Math.ceil(roles.length / 2);
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-7">
          <Eyebrow>Our Expertise</Eyebrow>
          <WordReveal as="h2" lines={["Project team", { text: "members", accent: ["members"] }]} className={headline} />
        </div>
        <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
          <p className="max-w-md text-sm leading-relaxed text-ink-soft">
            We are all young and vibrant professional youth with difference.
          </p>
        </Reveal>
      </div>
      <Reveal className="mt-14 space-y-3">
        <Ticker items={roles.slice(0, half)} />
        <Ticker items={roles.slice(half)} reverse />
      </Reveal>
    </section>
  );
}

/* ——— Partners: a typographic wall ——— */
function Partners() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Trusted By</Eyebrow>
            <WordReveal as="h2" lines={[{ text: "Our partners", accent: ["partners"] }]} className={headline} />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
            <p className="text-sm text-ink-soft">And many more trusted partners across Nigeria…</p>
          </Reveal>
        </div>
        <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-line">
          {partners.map((p, i) => (
            <Reveal
              as="li"
              key={p}
              y={12}
              delay={(i % 4) * 0.06}
              className="group relative flex min-h-28 md:min-h-32 items-center justify-center border-b border-r border-line bg-white px-4 text-center transition-colors duration-500 hover:bg-primary"
            >
              <span className="text-sm md:text-base font-medium text-primary transition-colors duration-500 group-hover:text-white">
                {p}
              </span>
              <span className="absolute right-3 top-3 text-[10px] tabular-nums text-ink-soft/50 transition-colors duration-500 group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ——— Community & CSR: an index list plus the award ——— */
function Community() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Giving Back</Eyebrow>
            <WordReveal as="h2" lines={["Community &", { text: "CSR activities", accent: ["CSR"] }]} className={headline} />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
                We believe in building more than properties — we build communities
                and empower lives.
              </p>
            </Reveal>

            {/* Award */}
            <Reveal delay={0.25} className="mt-10 border border-accent/50 bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-accent text-white">
                  <BsAward className="text-lg" />
                </span>
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Notable achievement</p>
              </div>
              <p className="mt-4 font-display font-bold text-2xl leading-snug text-primary">
                National Outstanding Leadership Award
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                The National Association of Nigeria Students (NANS) presented the
                National Outstanding Leadership Award to Hon. Andrew Adama,
                Chairman/CEO of Andreams Global Properties Limited.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          {/* Photos from the Andreams Annual Humanitarian Service — tap to browse all */}
          <CommunityGallery />
          <Reveal delay={0.1} as="p" className="mt-3 mb-10 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            Andreams Annual Humanitarian Service
          </Reveal>
        <ol className="border-t border-line">
          {programmes.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              y={16}
              delay={0.05}
              className="group grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7"
            >
              <span className="pt-1 text-[11px] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight text-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
