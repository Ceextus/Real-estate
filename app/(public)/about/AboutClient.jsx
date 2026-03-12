"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function AboutClient({ teamMembers }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-white text-gray-900 selection:bg-accent selection:text-white pb-32">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-primary"
      >
        <motion.div
          style={{ y: yImage, opacity }}
          className="absolute inset-0 z-0 origin-bottom">
          <div className="relative w-full h-full">
            <Image
              src="/images/team.jpg"
              alt="Andream Homes Team"
              fill
              className="object-cover object-bottom"
              priority
            />
            <div className="absolute inset-0 bg-primary/40 mix-blend-overlay" />
          </div>
        </motion.div>

        <div
          className="absolute bottom-0 left-0 w-full h-[150px] bg-white rounded-t-[50%] md:rounded-t-[100%] z-10"
          style={{ transform: "scaleX(1.1) translateY(50%)" }}
        />
      </section>

      {/* The Andream Homes Way Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Title & Mission */}
          <div>
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111] mb-8 tracking-tight">
              The Andream Homes Way
            </h1>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-10">
              <p>
                A real estate development company focused on creating bespoke
                luxury properties. We specialize in designing and building
                smart, sustainable homes that reflect the aspirations of our
                clients.
              </p>
              <p>
                <strong>Our Mission</strong>
                <br />
                To consistently deliver exceptional real estate solutions by
                leveraging technology, innovative design, and a commitment to
                quality.
              </p>
              <p>
                <strong>Our Vision</strong>
                <br />
                To be the premier real estate developer in the region, known for
                creating iconic spaces that inspire and elevate the standard of
                living.
              </p>
            </div>

            <Link 
              href="/contact"
              className="inline-block bg-accent text-white px-8 py-4 rounded-full font-bold tracking-wider hover:bg-primary transition-colors shadow-lg shadow-accent/20"
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="flex items-center">
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 w-full pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-12">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">👥</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">50+</div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Professionals</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">🏗️</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">12+</div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Projects</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">🥇</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">15+</div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Awards</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">🤝</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">300+</div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Minds Section */}
      <section className="bg-gray-50 py-24 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-2">
              The Core Team
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] tracking-tight">
              Meet the Minds Behind Andream Homes
            </h2>
          </div>

          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row gap-8 lg:gap-12"
              >
                {/* Image Portrait */}
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="relative aspect-[3/4] w-full rounded-tr-[50px] rounded-bl-[50px] overflow-hidden shadow-xl group">
                    <div className="absolute inset-0 bg-primary/10" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                    />
                    <div className="absolute left-0 top-0 h-full w-2 bg-accent" />
                  </div>
                </div>

                {/* Bio Content */}
                <div className="w-full md:w-2/3 flex flex-col justify-center">
                  <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                    {member.role}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#111] mb-6">
                    {member.name}
                  </h3>

                  <div className="space-y-4 text-gray-600 leading-relaxed text-[0.95rem]">
                    {member.bio?.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section: Hard Work Meets Creativity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="md:w-1/2">
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111] mb-8 leading-tight">
              Hard Work meets <br className="hidden lg:block" /> Creativity
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              At Andream Homes, we believe that true excellence is born at the
              intersection of relentless hard work and boundless creativity. Our
              dedication to pushing the boundaries of what is possible drives us
              to deliver projects that not only meet but exceed expectations.
            </p>
            <div className="flex gap-4">
              <span className="w-12 h-[2px] bg-accent mt-3"></span>
              <p className="font-medium text-gray-800 italic">
                &quot;We don&apos;t just build houses; we craft lifetime
                investments and curate lifestyles.&quot;
              </p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute inset-0 bg-gray-200" />
              <Image
                src="https://media.istockphoto.com/id/1485996637/photo/top-view-team-engineer-building-inspection-use-tablet-computer-and-blueprint-working-at.jpg?s=2048x2048&w=is&k=20&c=uj8876TrVM2VS-P9Cf8wFwK4EPD6YcrRlfSeooGSf4g="
                alt="Visionary Leadership"
                fill
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
