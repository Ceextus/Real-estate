"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";
import PropertyTile from "@/components/home/PropertyTile";

// Cards blur up in sequence once the grid is in view; on filter changes, leavers blur out
// and the remaining cards slide into their new places.
export default function PropertyGrid({ items, onClear, gridKey }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduce = useReducedMotion();

  const card = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(10px)" },
    shown: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay: i * 0.07, ease: EASE },
    }),
    exit: { opacity: 0, scale: 0.97, filter: "blur(6px)", transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.ul
        ref={ref}
        key={gridKey}
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => (
            <motion.li
              key={p.slug ?? p.id}
              layout
              custom={i}
              variants={card}
              initial="hidden"
              animate={inView ? "shown" : "hidden"}
              exit="exit"
            >
              <PropertyTile property={p} priority={i < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="border border-dashed border-line py-16 text-center"
          >
            <p className="text-sm text-primary">No properties match those filters yet.</p>
            <button
              onClick={onClear}
              className="mt-3 text-[13px] text-ink-soft underline underline-offset-4 hover:text-primary"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
