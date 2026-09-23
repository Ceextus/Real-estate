"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BsXLg, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { EASE } from "@/components/motion/Reveal";

const pad = (n) => String(n).padStart(2, "0");

// Full-screen photo viewer. `list` items: { id, url, caption?, label? }.
// Arrow keys / Esc, swipe on touch, thumbnail strip; page scroll is locked while open.
export default function Lightbox({ list, index, onIndex, onClose }) {
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const img = list[index];

  const go = useCallback(
    (step) => {
      setDirection(step);
      onIndex((index + step + list.length) % list.length);
    },
    [index, list.length, onIndex]
  );

  // Keyboard controls + lock page scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const slide = {
    enter: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 60, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -60, filter: "blur(8px)" }),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-100 flex flex-col bg-primary/97 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 h-20 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
          <span className="text-white tabular-nums">{pad(index + 1)}</span> / {pad(list.length)}
          {img.label && <span className="ml-4 text-accent">{img.label}</span>}
        </p>
        <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center border border-white/15 transition-colors hover:bg-white hover:text-primary">
          <BsXLg />
        </button>
      </div>

      {/* Image */}
      <div className="relative flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={img.id}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
            className="absolute inset-0 mx-4 sm:mx-24 cursor-grab active:cursor-grabbing"
          >
            <Image src={img.url} alt={img.caption || img.label || "Photo"} fill sizes="90vw" className="object-contain pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-colors hover:bg-white hover:text-primary">
          <BsChevronLeft />
        </button>
        <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-colors hover:bg-white hover:text-primary">
          <BsChevronRight />
        </button>
      </div>

      {/* Caption + thumbnails */}
      <div className="px-4 sm:px-8 py-5" onClick={(e) => e.stopPropagation()}>
        <p className="min-h-5 text-center text-sm text-white/80">{img.caption}</p>
        <ul className="mx-auto mt-4 flex max-w-4xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {list.map((t, i) => (
            <li key={t.id} className="shrink-0">
              <button
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  onIndex(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                className={`relative block h-14 w-20 overflow-hidden transition-opacity duration-300 ${
                  i === index ? "opacity-100 ring-2 ring-accent" : "opacity-40 hover:opacity-80"
                }`}
              >
                <Image src={t.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
