"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LogoLoader from "@/components/LogoLoader";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Supabase
  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (projects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const handleNext = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (loading) return <LogoLoader />;
  if (projects.length === 0) return null;

  return (
    <section className="relative bg-[#1a3828] pt-24 pb-24 overflow-hidden">
      {/* Texture: Vertical Grid Lines Background matching the reference */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "15% 100%",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full border border-white/20 flex items-center justify-center shrink-0">
              <div className="absolute top-1 left-3 text-accent text-xl">✦</div>
              <div className="w-14 h-14 rounded-full border border-white/10 opacity-70" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium text-white tracking-wide">
              The Project
            </h2>
          </div>
          <p className="max-w-md text-white/80 text-sm leading-relaxed font-medium">
            Together, we can conquer challenges, utilize our strengths, and
            achieve remarkable success in this ambitious home project.
          </p>
        </div>

        {/* Slider Area */}
        <div className="relative w-full h-[500px] md:h-[650px] rounded-[30px] md:rounded-[60px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-black/20">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Link
                href={`/properties/${projects[currentIndex].slug}`}
                className="absolute inset-0 block group/link cursor-pointer"
              >
                <Image
                  src={projects[currentIndex].image}
                  alt={projects[currentIndex].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/link:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              </Link>

              {/* Data Overlay */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-8 md:p-12 mb-4 md:mb-0"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    {/* Tags: Type & Location */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                        {projects[currentIndex].type}
                      </span>
                      <div className="flex items-center text-white text-sm bg-white/20 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full font-medium">
                        <HiOutlineLocationMarker className="mr-1.5 text-accent text-lg" />
                        {projects[currentIndex].location}
                      </div>
                    </div>
                    {/* Title */}
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                      {projects[currentIndex].title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-3xl shrink-0 text-center min-w-[200px]">
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-1.5 font-medium">
                      Asking Price
                    </p>
                    <p className="text-accent text-2xl md:text-3xl font-bold">
                      {projects[currentIndex].price}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-5 mt-12">
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <BsArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <BsArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
