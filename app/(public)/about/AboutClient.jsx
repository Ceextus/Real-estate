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
          className="absolute inset-0 z-0 origin-bottom"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/team.jpg"
              alt="Andreams Homes Team"
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

      {/* The Andreams Homes Way Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Title & Mission */}
          <div>
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111] mb-8 tracking-tight">
              The Andreams Homes Way
            </h1>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-10">
              <div className="bg-accent/5 border-l-4 border-accent p-6 rounded-r-xl mb-2">
                <p className="mb-4">
                  <strong className="text-[#111]">Our Vision</strong>
                  <br />
                  To deliver affordable and quality homes to all classes of people in Nigeria.
                </p>
                <p>
                  <strong className="text-[#111]">Our Mission</strong>
                  <br />
                  Our mission and values is to help people and businesses in Nigeria realize their dreams of owning properties and create wealth.
                </p>
              </div>
              <p>
                Founded in Abuja FCT in the year 2013 and started full operation in the year 2015, ANDREAMS GLOBAL PROPERTIES LTD, is a property development company that is based in Abuja. Our aim of starting this business is to work in tandem with the government of Nigeria and private and individuals to deliver affordable homes and properties for all classes of people in Nigeria. Our Head Office is located in Abuja FCT with a branch office in Anyigba kogi state.
              </p>
              <p>
                ANDREAMS GLOBAL PROPERTIES COMPANY is a self-administered and a self-managed real estate investment trust (REIT). We will work towards becoming one of the largest owners, managers, and developers of first-class properties (accommodations, public buildings and office properties) in Nigeria.
              </p>
              <p>
                We are quite aware that property development business requires a huge capital base, which is why we have perfect plans for steady flow of cash from private investors who are interested in working with us. We can confidently say that we have a robust financial standing and we are ready to take on any property development deal that comes our way.
              </p>
              <p>
                As part of our plans to make our customers our number one priority and to become the leading property development company in Nigeria, we have perfected plans to work with our clients to deliver projects that can favorably compete with the best in the industry, at an affordable and reasonable price within the stipulated completion date barring any unforeseen circumstance and also to generate great value from any property that we manage (both for our clients and for the company).
              </p>
              <p>
                ANDREAM GLOBAL PROPERTIES LTD COMPANY will become a specialist in turning slums into beautiful cities and turning a run-down and dilapidated building into a master piece. And that hopefully will be our brand and signature.
              </p>
              <p>
                ANDREAMS GLOBAL PROPERTIES LTD COMPANY is majorly owned by Andrew Adama and family. Andrew Adama is a property guru that has worked with top Real Estate Companies in FCT Abuja for many years; prior to starting his own business. Other investors with same investment ideology whose name cannot be mentioned here for obvious reasons are also part owners of the business.
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
                  <div className="text-accent text-4xl">🏗️</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">
                    9+
                  </div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                  Projects
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">📅</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">
                    13+
                  </div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                  Years of Experience
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">👥</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">
                    13+
                  </div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                  Professional Roles
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <div className="text-accent text-4xl">🤝</div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#111]">
                    300+
                  </div>
                </div>
                <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                  Happy Clients
                </p>
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
              Meet the Minds Behind Andreams Homes
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
              At Andreams Homes, we believe that true excellence is born at the
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

      {/* Professional Team Roles Section */}
      <section className="bg-[#111] py-24 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-2">
              Our Expertise
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Project Team Members
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We are all young and vibrant professional youth with difference
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
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
            ].map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/30 transition-colors">
                  <span className="text-accent text-sm font-bold">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-white/80 text-sm font-medium leading-snug">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-gray-50 py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-2">
              Trusted By
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] tracking-tight">
              Our Partners
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
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
            ].map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-center text-center shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 min-h-[100px]"
              >
                <p className="text-gray-700 font-semibold text-sm">{partner}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8 font-medium">
            And many more trusted partners across Nigeria...
          </p>
        </div>
      </section>

      {/* CSR / Community Activities Section */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-accent text-sm font-bold tracking-widest uppercase mb-2">
              Giving Back
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] tracking-tight mb-4">
              Community &amp; CSR Activities
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We believe in building more than properties — we build communities and empower lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "Yearly Widows Empowerment Programme",
                description: "Annual programme supporting and empowering widows across our communities.",
                icon: "💜",
              },
              {
                title: "Orphanage & Widows Empowerment Program",
                description: "Dedicated support for orphanages and widows through resources and mentorship.",
                icon: "🤝",
              },
              {
                title: "Andream JAMB Empowerment",
                description: "Supporting students with JAMB registration fees to pursue higher education.",
                icon: "🎓",
              },
              {
                title: "Sports Unites the Youths",
                description: "Football tournament support programme bringing communities together through sports.",
                icon: "⚽",
              },
              {
                title: "Tournament Support Programme",
                description: "Sponsoring and organizing sporting events to nurture young talent.",
                icon: "🏆",
              },
              {
                title: "Community School Recognition",
                description: "Recognized by Community Secondary School students for outstanding community service.",
                icon: "🏫",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-accent/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#111] mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notable Achievement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-accent/5 border-l-4 border-accent rounded-r-2xl p-8 text-center"
          >
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-xl font-bold text-[#111] mb-2">National Outstanding Leadership Award</h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              The National Association of Nigeria Students (NANS) presented the{" "}
              <strong>National Outstanding Leadership Award</strong> to{" "}
              <strong>Hon. Andrew Adama</strong>, Chairman/CEO of Andreams Global Properties Limited.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
