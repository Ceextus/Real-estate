"use client";

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
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import PromiseBanner from "@/components/home/PromiseBanner";

const features = [
  {
    icon: BsDropletHalf,
    title: "Water (Bore Holes)",
    description:
      "Reliable water supply through modern bore hole systems across all estates.",
  },
  {
    icon: BsLightningCharge,
    title: "Electricity (PHCN)",
    description:
      "Direct PHCN power connection with infrastructure for stable electricity supply.",
  },
  {
    icon: BsSignpost2,
    title: "Access Road & Police Post",
    description:
      "Well-constructed access roads and police post for secure, easy entry and exit.",
  },
  {
    icon: BsHospital,
    title: "Clinic & School",
    description:
      "On-estate healthcare clinics and schools for residents and families.",
  },
  {
    icon: BsBuilding,
    title: "Religious Centres",
    description:
      "Dedicated spaces for worship and religious activities within the estate.",
  },
  {
    icon: BsShop,
    title: "Shopping Malls & Corner Shops",
    description:
      "Convenient shopping centres and corner shops for everyday necessities.",
  },
  {
    icon: BsTrophy,
    title: "Sport Facilities",
    description:
      "Recreational and sport facilities to promote healthy living within estates.",
  },
  {
    icon: BsBusFront,
    title: "Estate Transport & ATM",
    description:
      "Estate transport services and ATM Galaxy for residents' convenience.",
  },
];

export default function EstateFeatures() {
  return (
    <section className="relative bg-canvas py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Standard Estate Facilities
            </Reveal>
            <WordReveal
              as="h2"
              lines={[
                "Reliable facilities",
                { text: "in every Andreams estate", accent: ["every"] },
              ]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-primary"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">
              Every Andreams estate comes with these standard facilities —
              ensuring quality infrastructure and a comfortable living environment
              for all residents.
            </p>
          </Reveal>
        </div>

        {/* Facility cards */}
        <ul className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={(i % 4) * 0.08}
              className="group relative flex min-h-56 flex-col border border-line bg-white p-6 transition-colors duration-500 hover:border-primary/25"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center border border-line text-primary transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  <Icon className="text-lg" />
                </span>
                <span className="text-[11px] tabular-nums text-ink-soft/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-auto pt-10 text-base font-medium text-primary">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{description}</p>
              {/* Gold rule draws across the bottom on hover */}
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </Reveal>
          ))}
        </ul>

        <PromiseBanner />
      </div>
    </section>
  );
}
