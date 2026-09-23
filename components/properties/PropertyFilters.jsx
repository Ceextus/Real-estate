"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LuSearch, LuX } from "react-icons/lu";
import { EASE } from "@/components/motion/Reveal";

// Same options the admin form uses for `property_type`.
export const PROPERTY_TYPES = ["All", "Buy & Build", "Move-In Ready", "Investment / Residential"];

export const matchesFilters = (p, type, query) => {
  const q = query.trim().toLowerCase();
  return (
    (type === "All" || p.property_type === type) &&
    (!q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q))
  );
};

// Tabs for property type + a name/location search. `action` renders at the right of the search row.
export default function PropertyFilters({ type, onType, query, onQuery, onClear, action, id = "type" }) {
  const filtered = type !== "All" || query.trim() !== "";

  return (
    <div className="border border-line bg-white">
      <LayoutGroup id={`${id}-tabs`}>
        <div role="tablist" aria-label="Property type" className="flex overflow-x-auto border-b border-line">
          {PROPERTY_TYPES.map((t) => {
            const active = t === type;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => onType(t)}
                className={`relative shrink-0 px-5 py-3.5 text-[13px] transition-colors duration-300 ${
                  active ? "text-primary" : "text-ink-soft hover:text-primary"
                }`}
              >
                {t === "Investment / Residential" ? "Investment" : t}
                {active && (
                  <motion.span
                    layoutId={`${id}-underline`}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="flex flex-col md:flex-row md:items-center gap-3 p-3">
        <label className="relative flex flex-1 items-center">
          <span className="sr-only">Search by name or location</span>
          <LuSearch className="pointer-events-none absolute left-3.5 text-base text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name or location — e.g. Karu, Idu, Gwarimpa"
            className="w-full border border-line bg-canvas py-3 pl-10 pr-3 text-sm text-primary placeholder:text-ink-soft/70 outline-none transition-colors duration-300 focus:border-primary/40 focus:bg-white"
          />
        </label>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {filtered && (
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3 py-3 text-[13px] text-ink-soft hover:text-primary"
              >
                <LuX className="text-sm" />
                Clear filters
              </motion.button>
            )}
          </AnimatePresence>
          {action}
        </div>
      </div>
    </div>
  );
}
