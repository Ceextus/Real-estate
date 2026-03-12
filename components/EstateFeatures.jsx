"use client";

import { motion } from "framer-motion";
import {
  BsShieldCheck,
  BsCarFront,
  BsFingerprint,
  BsPersonCheck,
} from "react-icons/bs";

const features = [
  {
    icon: <BsShieldCheck className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Central Security Control",
    description:
      "24/7 monitoring and response systems ensuring complete peace of mind.",
  },
  {
    icon: <BsCarFront className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Automatic Numberplate Recognition",
    description:
      "Seamless and secure vehicle access control for residents and approved guests.",
  },
  {
    icon: <BsFingerprint className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Pedestrian Biometric Access Control",
    description:
      "Advanced fingerprint scanning for secure pedestrian entry and exit.",
  },
  {
    icon: <BsPersonCheck className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Facial Recognition",
    description:
      "State-of-the-art facial recognition technology for enhanced estate security.",
  },
];

export default function EstateFeatures() {
  return (
    <section className="relative bg-black py-24 md:py-32 overflow-hidden selection:bg-accent selection:text-black">
      {/* Decorative Top Curve (Inverted Arch) */}
      <div
        className="absolute top-0 left-0 w-full h-[150px] bg-primary rounded-b-[50%] md:rounded-b-[100%] z-0"
        style={{ transform: "scaleX(1.1) translateY(-50%)" }}  
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-accent tracking-wide">
            Estate Features & Lands
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto font-medium">
            Secure your future with our premium lands offering authentic C of O
            titles and state-of-the-art infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-white/3 border border-white/5 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-[250px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent mb-16" />

          <div className="text-center">
            <div className="w-2 h-2 bg-accent rounded-full mx-auto mb-8 shadow-[0_0_10px_rgba(224,155,107,0.8)]" />
            <p className="text-white text-lg md:text-xl font-medium tracking-wide mb-6">
              &quot;We will never stop delivering the highest quality lands and
              properties with secure titles.&quot;
            </p>
            <p className="text-gray-400 font-medium">
              - Andream Homes Team.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
