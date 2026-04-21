"use client";

import { motion } from "framer-motion";
import {
  BsDropletHalf,
  BsLightningCharge,
  BsSignpost2,
  BsHospital,
  BsShop,
  BsTrophy,
  BsBuilding,
  BsBusFront,
} from "react-icons/bs";

const features = [
  {
    icon: <BsDropletHalf className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Water (Bore Holes)",
    description:
      "Reliable water supply through modern bore hole systems across all estates.",
  },
  {
    icon: <BsLightningCharge className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Electricity (PHCN)",
    description:
      "Direct PHCN power connection with infrastructure for stable electricity supply.",
  },
  {
    icon: <BsSignpost2 className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Access Road & Police Post",
    description:
      "Well-constructed access roads and police post for secure, easy entry and exit.",
  },
  {
    icon: <BsHospital className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Clinic & School",
    description:
      "On-estate healthcare clinics and schools for residents and families.",
  },
  {
    icon: <BsBuilding className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Religious Centres",
    description:
      "Dedicated spaces for worship and religious activities within the estate.",
  },
  {
    icon: <BsShop className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Shopping Malls & Corner Shops",
    description:
      "Convenient shopping centres and corner shops for everyday necessities.",
  },
  {
    icon: <BsTrophy className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Sport Facilities",
    description:
      "Recreational and sport facilities to promote healthy living within estates.",
  },
  {
    icon: <BsBusFront className="text-4xl md:text-5xl text-accent mb-6" />,
    title: "Estate Transport & ATM",
    description:
      "Estate transport services and ATM Galaxy for residents' convenience.",
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
            Standard Estate Facilities
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto font-medium">
            Every Andreams estate comes with these standard facilities — ensuring quality infrastructure and a comfortable living environment for all residents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 mb-24">
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
            <div className="w-2 h-2 bg-accent rounded-full mx-auto mb-8 shadow-[0_0_10px_rgba(201,168,76,0.8)]" />
            <p className="text-white text-lg md:text-xl font-medium tracking-wide mb-6">
              &quot;We will never stop delivering the highest quality lands and
              properties with secure titles.&quot;
            </p>
            <p className="text-gray-400 font-medium">- Andreams Global Properties Ltd.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
