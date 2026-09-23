"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import PropertyFilters, { PROPERTY_TYPES, matchesFilters } from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";

const ITEMS_PER_PAGE = 9;

export default function PropertiesClient({ properties, initialFilter, initialSearch = "" }) {
  const [query, setQuery] = useState(initialSearch);
  const [type, setType] = useState(PROPERTY_TYPES.includes(initialFilter) ? initialFilter : "All");
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);

  const matches = useMemo(
    () =>
      properties
        .filter((p) => matchesFilters(p, type, query))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [properties, type, query]
  );

  const totalPages = Math.max(1, Math.ceil(matches.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = matches.slice(start, start + ITEMS_PER_PAGE);

  // Keep the URL in step with the filters so a filtered view can be shared or bookmarked.
  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== "All") params.set("type", type);
    if (query.trim()) params.set("q", query.trim());
    const url = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [type, query]);

  const changeType = (t) => {
    setType(t);
    setPage(1);
  };
  const changeQuery = (q) => {
    setQuery(q);
    setPage(1);
  };
  const clear = () => {
    setType("All");
    setQuery("");
    setPage(1);
  };
  const goToPage = (p) => {
    setPage(p);
    const top = resultsRef.current?.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-canvas pt-10 md:pt-16 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <Reveal onMount className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Our Portfolio
            </Reveal>
            <WordReveal
              as="h1"
              onMount
              delay={0.15}
              lines={[{ text: "Discover exceptional", accent: ["exceptional"] }, "properties"]}
              className="mt-5 font-display font-bold text-[3.25rem] sm:text-7xl lg:text-[6rem] leading-[0.95] tracking-tight text-primary"
            />
          </div>
          <Reveal onMount delay={0.45} className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Browse affordable properties for sale in Abuja and Lagos — duplexes,
              bungalows, serviced plots and land, with verified C of O titles.
            </p>
            <p className="mt-6 text-4xl font-semibold leading-none tracking-tight text-primary tabular-nums">
              {properties.length}
              <span className="ml-2 align-middle text-[11px] font-normal uppercase tracking-[0.16em] text-ink-soft">
                listings
              </span>
            </p>
          </Reveal>
        </div>

        {/* Filters */}
        <Reveal onMount delay={0.55} className="mt-12">
          <PropertyFilters
            id="listing"
            type={type}
            onType={changeType}
            query={query}
            onQuery={changeQuery}
            onClear={clear}
            action={
              <p className="px-3 text-[13px] text-ink-soft whitespace-nowrap" aria-live="polite">
                <span className="text-primary">{matches.length}</span>{" "}
                {matches.length === 1 ? "property" : "properties"}
              </p>
            }
          />
        </Reveal>

        {/* Results */}
        <div ref={resultsRef} className="mt-12 mb-5 flex items-end justify-between gap-4 text-[13px] text-ink-soft">
          <p className="text-sm font-medium text-primary">
            {type === "All" ? "All properties" : type}
          </p>
          {matches.length > 0 && (
            <p className="tabular-nums">
              {start + 1}–{Math.min(start + ITEMS_PER_PAGE, matches.length)} of {matches.length}
            </p>
          )}
        </div>

        <PropertyGrid items={visible} onClear={clear} gridKey={page} />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center border border-line bg-white text-primary transition-colors hover:border-primary/40 disabled:opacity-30 disabled:hover:border-line"
            >
              <HiChevronLeft className="text-lg" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => goToPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`h-11 min-w-11 px-3 text-sm tabular-nums transition-colors ${
                  n === page
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-primary hover:border-primary/40"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => goToPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center border border-line bg-white text-primary transition-colors hover:border-primary/40 disabled:opacity-30 disabled:hover:border-line"
            >
              <HiChevronRight className="text-lg" />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
