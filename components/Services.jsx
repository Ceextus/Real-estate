"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BsCheckCircleFill } from "react-icons/bs";

const servicesList = [
  {
    title: "Consultation",
    icon: "/images/icon-consult.png", // Using a placeholder concept, we'll use react-icons for now
  },
  {
    title: "Design & Automation",
    icon: "/images/icon-design.png",
  },
  {
    title: "Construction",
    icon: "/images/icon-build.png",
  },
  {
    title: "Project Management",
    icon: "/images/icon-manage.png",
  },
  {
    title: "Smart Investment",
    icon: "/images/icon-invest.png",
  },
];

export default function Services() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transform for the background shape (moves slower than scroll)
  const yBg = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  // Parallax transform for the yellow/accent line (fills up as we scroll)
  const lineScaleY = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    // Removed `overflow-hidden` crucial for `position: sticky` to work!
    <section
      ref={containerRef}
      className="relative bg-primary pt-20 pb-20 border-t border-white/5 selection:bg-accent selection:text-white"
    >
      {/* Parallax Background Shape */}
      <motion.div
        style={{ y: yBg }}
        className="absolute top-0 right-[10%] w-[30vw] h-[30vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Side: Sticky Text Content */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 lg:pr-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4">
                  Our Services
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  What we offer <br /> our clients
                </h2>

                <p className="text-white/60 text-base leading-relaxed font-medium">
                  Step into a world where your needs shape our services.
                  Offering bespoke configurations, innovative design &
                  automation, meticulous construction, and strategic project
                  management, we make your journey seamless.
                  <br />
                  <br />
                  Plus, unlock smart investment avenues for unparalleled ROI.
                  With us, it&apos;s more than a home—it&apos;s a lifetime
                  investment.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Compact Parallax Scrolling Cards */}
          <div className="lg:w-1/2 relative mt-10 lg:mt-0 flex gap-8">
            {/* The Cards Column */}
            <div className="flex-1 flex flex-col gap-4 md:gap-6 py-10 lg:py-48">
              {servicesList.map((service, idx) => (
                <ServiceCard key={idx} service={service} index={idx} />
              ))}
            </div>

            {/* The vertical animated accent line (from the reference) */}
            <div className="w-1.5 bg-white/5 rounded-full overflow-hidden self-stretch my-10 lg:my-48 hidden sm:block">
              <motion.div
                className="w-full bg-accent origin-top"
                style={{ height: lineScaleY }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 90%", "end 20%"],
  });

  // Individual card subtle parallax & fade
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.1, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y }}
      className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-5 hover:bg-white/10 hover:border-accent/40 hover:scale-[1.02] transition-all duration-300 shadow-lg cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:bg-accent/20 transition-colors">
        <BsCheckCircleFill className="text-white/40 group-hover:text-accent text-xl transition-colors" />
      </div>

      <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
        {service.title}
      </h3>
    </motion.div>
  );
}
