"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import PropertyFilters, { matchesFilters } from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";

const SHOWN = 6;

export default function PropertiesShowcase({ properties }) {
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const matches = useMemo(
    () => properties.filter((p) => matchesFilters(p, type, query)),
    [properties, type, query]
  );

  const params = new URLSearchParams();
  if (type !== "All") params.set("type", type);
  if (query.trim()) params.set("q", query.trim());
  const browseHref = `/properties${params.size ? `?${params}` : ""}`;
  const clear = () => {
    setType("All");
    setQuery("");
  };

  return (
    <section className="relative bg-canvas pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Our Portfolio
            </Reveal>
            <WordReveal
              as="h2"
              lines={[
                "We help you find the",
                { text: "home that will be yours", accent: ["home"] },
              ]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-primary"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">
              Browse affordable properties for sale across Abuja and Lagos —
              duplexes, bungalows, serviced plots and land, with verified C of O
              titles.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <PropertyFilters
            id="home"
            type={type}
            onType={setType}
            query={query}
            onQuery={setQuery}
            onClear={clear}
            action={
              <Link
                href={browseHref}
                className="group inline-flex flex-1 md:flex-none items-center justify-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
              >
                Show {matches.length} {matches.length === 1 ? "property" : "properties"}
                <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-14 mb-5 flex items-end justify-between gap-4">
          <Reveal as="h3" className="text-sm font-medium text-primary">
            New properties
          </Reveal>
          <Reveal>
            <Link
              href="/properties"
              className="group inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-primary transition-colors"
            >
              View all
              <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <PropertyGrid items={matches.slice(0, SHOWN)} onClear={clear} />
      </div>
    </section>
  );
}
