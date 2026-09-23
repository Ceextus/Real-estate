"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";

export default function Hero() {
  const bandRef = useRef(null);
  const reduce = useReducedMotion();

  // Photo drifts slower than the page while the band scrolls out of view.
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      className="relative pt-10 md:pt-16"
      // Cream at the top, easing into the photo's sky (sampled left → right) so the two meet seamlessly.
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--color-canvas) 0%, transparent 30%), linear-gradient(to right, #C9D4E2 0%, #D7DFEB 40%, #E7ECF0 75%, #ECF0F5 100%)",
      }}
    >
      {/* Headline row — layered above the photo, which rises up behind it */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8">
            <WordReveal
              as="h1"
              onMount
              delay={0.25}
              lines={[
                { text: "Find your dream", accent: ["dream"] },
                { text: "home now!", accent: ["home"] },
              ]}
              className="font-display text-[3.25rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight text-primary font-bold"
            />

            <Reveal onMount delay={0.7} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/properties"
                className="group inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
              >
                Explore properties
                <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-primary/20 bg-canvas/70 backdrop-blur-sm px-5 py-3 text-sm text-primary transition-colors duration-300 hover:border-primary/50 hover:bg-canvas"
              >
                Book an inspection
              </Link>
            </Reveal>
          </div>

          <Reveal onMount delay={0.55} className="lg:col-span-4 lg:pt-4">
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              With Andreams Homes, anyone can discover the perfect property. Just
              start with what you know. It&apos;s that easy.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed photo band: its sky is masked into the section background above */}
      <motion.div
        ref={bandRef}
        initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(16px)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4, delay: 0.45, ease: EASE }}
        className="pointer-events-none relative -mt-6 md:-mt-32 lg:-mt-40 h-[78vh] min-h-130 max-h-215 w-full overflow-hidden mask-[linear-gradient(to_bottom,transparent_0px,black_140px)]"
      >
        <motion.div
          style={reduce ? undefined : { y: imageY }}
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, delay: 0.45, ease: EASE }}
          className="absolute inset-x-0 -inset-y-[8%]"
        >
          <Image
            src="/images/modern-architecture-building-with-geometric-facade-clean-lines-clear-sky.jpg"
            alt="Modern residential building with a geometric white facade under a clear sky"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[85%_20%] md:object-[50%_20%]"
          />
        </motion.div>

        {/* Soft fade at the bottom so the badge reads over the facade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/35 to-transparent" />

        <Reveal
          onMount
          delay={1.3}
          className="absolute bottom-5 left-4 sm:left-6 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] flex items-center gap-3 border border-line bg-canvas px-4 py-3 shadow-lg shadow-primary/10"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Starting at
            </p>
            <p className="text-lg font-medium text-primary">₦50M</p>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
