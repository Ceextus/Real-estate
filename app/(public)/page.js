"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BsSearch, BsArrowRight } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import EstateFeatures from "@/components/EstateFeatures";
import Projects from "@/components/Projects";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Mouse tracker effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-primary pt-28">
      {/* Custom Mouse Tracker */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/50 pointer-events-none z-[100] hidden md:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-100 hidden md:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.1 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-7rem)] flex items-center pb-12 overflow-hidden">
        {/* Grain Texture Overlay */}
        <div className="grain" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              style={{ y: y1, opacity }}
              className="flex flex-col justify-center max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] font-extrabold text-white leading-[1.05] mb-6 tracking-tight"
              >
                Find your <br />
                <span className="text-accent">dream home</span> <br />
                now!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/80 text-lg md:text-xl font-medium tracking-wide leading-relaxed max-w-2xl mx-auto drop-shadow-md"
            >
              With Andream Homes, anyone can discover the perfect property. Just start with what you know. It&apos;s that easy.
            </motion.p>
              
              {/* Search Element matching the reference design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/10 backdrop-blur-md p-2 rounded-full flex items-center shadow-2xl border border-white/20 max-w-md w-full"
              >
                <div className="flex items-center text-accent pl-4 pr-3 border-r border-white/20">
                  <HiOutlineHome className="text-xl" />
                  <span className=" font-clash ml-2 text-white font-semibold text-sm">Property</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter location or type" 
                  className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-white/60 font-medium text-sm"
                />
                <button className="bg-accent hover:bg-white hover:text-accent border border-transparent hover:border-accent text-white w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(224,155,107,0.3)]">
                  <BsArrowRight className="text-xl" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Asset (Video/Image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
              className="relative h-[450px] lg:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                {/* Local Video -rs.mp4 */}
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/images/rs.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-primary/20 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 shadow-inner rounded-[2.5rem] pointer-events-none border border-black/10" />
              </div>

              {/* Decorative floating element */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                className="absolute top-1/4 -right-6 lg:-right-12 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-lg">
                  $
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium">Starting at</p>
                  <p className="text-white font-bold text-lg">₦50M</p>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
        </div>
      </section>
      <section>
        <AboutUs />
      </section>

      {/* Services Section */}
      <Services />

     

      {/* Projects Slider Section */}
      <Projects />

       {/* Estate Features & Lands Section */}
      <EstateFeatures />
      
    </main>
  );
}