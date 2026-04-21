"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { BsPlayFill } from "react-icons/bs";

const stats = [
  { value: "9", suffix: "+", label: "Projects Delivered" },
  { value: "13", suffix: "+", label: "Years of Experience" },
  { value: "300", suffix: "+", label: "Happy Clients" },
];

export default function AboutUs() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const videoY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={containerRef}
      className="bg-[#070D1A] relative pt-32 pb-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24"
        >
          {/* Left Column: Heading and Left Info */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mb-16 lg:mb-0"
            >
              <div className="relative w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
                <div className="absolute top-0 left-3 w-2 h-2 rounded-full bg-accent" />
                <div className="w-12 h-12 rounded-full border border-dashed border-white/10 animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-medium text-white tracking-wide">
                About Us
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-sm mt-auto">
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                ANDREAM GLOBAL PROPERTIES LTD will become a specialist in turning slums into beautiful cities and turning a run-down and dilapidated building into a master piece.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-accent hover:bg-white text-white hover:text-primary px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Main Text and Stats */}
          <div className="lg:col-span-8 lg:pl-12">
            <motion.h3
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-8"
            >
              WE&apos;VE FOUND{" "}
              <span className="text-white/30">
                LUXURY
                <br />
                HOMES FOR CLIENTS
              </span>
              <br />
              FOR A DECADE.
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-white/60 text-lg max-w-2xl leading-relaxed mb-16"
            >
              Founded in Abuja FCT in the year 2013 and started full operation in the year 2015, ANDREAMS GLOBAL PROPERTIES LTD, is a property development company that is based in Abuja. Our aim of starting this business is to work in tandem with the government of Nigeria and private and individuals to deliver affordable homes and properties for all classes of people in Nigeria.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 border-t border-white/10 pt-12">
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-4xl text-accent font-bold">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Video Cutout Section */}
        <motion.div
          style={{ scale: videoScale, y: videoY }}
          className="relative w-full h-[600px] md:h-[700px] mt-12 rounded-[50px] md:rounded-[100px] overflow-hidden group shadow-2xl"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/images/logo.png"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          >
            <source
              src="images/site.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/20" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary shadow-[0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-md mb-8 transition-transform"
            >
              <BsPlayFill className="text-4xl ml-1" />
            </motion.button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-12 bg-linear-to-t from-black/90 via-black/50 to-transparent flex justify-center">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold text-white/90 tracking-tight uppercase">
              Dream House
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
    </section>
  );
}
