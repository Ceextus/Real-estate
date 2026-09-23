"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BsXLg, BsChevronLeft, BsChevronRight, BsArrowsFullscreen } from "react-icons/bs";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";

const pad = (n) => String(n).padStart(2, "0");
// Photos come without dimensions, so the masonry cycles through a few frame shapes for rhythm.
const SHAPES = ["aspect-4/5", "aspect-square", "aspect-4/3", "aspect-3/4", "aspect-16/10"];
const FILMSTRIP_COUNT = 8;

export default function GalleryClient({ images }) {
  const [category, setCategory] = useState("All");
  const [viewer, setViewer] = useState(null); // { list, index }

  const categories = useMemo(() => {
    const counts = images.reduce((acc, img) => {
      acc[img.category] = (acc[img.category] ?? 0) + 1;
      return acc;
    }, {});
    return [["All", images.length], ...Object.entries(counts)];
  }, [images]);

  const filtered = category === "All" ? images : images.filter((i) => i.category === category);
  const open = (list, index) => setViewer({ list, index });

  return (
    <main className="min-h-screen bg-canvas pt-10 md:pt-16 pb-24 md:pb-32 overflow-x-clip">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <Reveal onMount className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Gallery
          </Reveal>
          <WordReveal
            as="h1"
            onMount
            delay={0.15}
            lines={[{ text: "Our gallery", accent: ["gallery"] }]}
            className="mt-5 font-display font-bold text-[3.25rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight text-primary"
          />
        </div>
        <Reveal onMount delay={0.4} className="lg:col-span-4 lg:pb-3">
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Explore our stunning collection of luxury properties, interiors, and
            world-class amenities.
          </p>
          <p className="mt-6 text-4xl font-semibold leading-none tracking-tight text-primary tabular-nums">
            {images.length}
            <span className="ml-2 align-middle text-[11px] font-normal uppercase tracking-[0.16em] text-ink-soft">
              photos
            </span>
          </p>
        </Reveal>
      </div>

      {images.length > 0 && (
        <Filmstrip items={images.slice(0, FILMSTRIP_COUNT)} onOpen={(i) => open(images, i)} />
      )}

      {/* Full collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 md:mt-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <WordReveal
            as="h2"
            lines={["The full collection"]}
            className="font-display font-bold text-3xl sm:text-4xl leading-none tracking-tight text-primary"
          />
          <LayoutGroup id="gallery-tabs">
            <Reveal role="tablist" aria-label="Category" className="flex overflow-x-auto border-b border-line">
              {categories.map(([name, count]) => {
                const active = name === category;
                return (
                  <button
                    key={name}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(name)}
                    className={`relative shrink-0 px-4 py-3 text-[13px] transition-colors duration-300 ${
                      active ? "text-primary" : "text-ink-soft hover:text-primary"
                    }`}
                  >
                    {name}
                    <span className="ml-1.5 text-[10px] tabular-nums text-ink-soft/70">{count}</span>
                    {active && (
                      <motion.span
                        layoutId="gallery-underline"
                        transition={{ duration: 0.5, ease: EASE }}
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                      />
                    )}
                  </button>
                );
              })}
            </Reveal>
          </LayoutGroup>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 border border-dashed border-line py-16 text-center text-sm text-ink-soft">
            No images in this category yet.
          </p>
        ) : (
          <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <GalleryTile key={img.id} img={img} index={i} onOpen={() => open(filtered, i)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AnimatePresence>
        {viewer && (
          <Lightbox
            list={viewer.list}
            index={viewer.index}
            onIndex={(index) => setViewer((v) => ({ ...v, index }))}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ——— Filmstrip: pinned on desktop, vertical scroll pans the row sideways ——— */
function Filmstrip({ items, onOpen }) {
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <>
      {/* Desktop */}
      <div ref={trackRef} className="relative hidden lg:block mt-16 h-[260vh]">
        <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col justify-center overflow-hidden">
          <motion.ul style={reduce ? undefined : { x }} className="flex w-max items-center gap-4 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 will-change-transform">
            {items.map((img, i) => (
              <li key={img.id} className="shrink-0">
                <button
                  onClick={() => onOpen(i)}
                  className={`group relative block overflow-hidden bg-surface ${
                    i % 2 ? "h-[52vh] w-[34vw]" : "h-[64vh] w-[28vw]"
                  }`}
                  aria-label={`Open photo ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || `${img.category} photo`}
                    fill
                    sizes="34vw"
                    priority={i < 3}
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-3 top-3 bg-canvas px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                    {pad(i + 1)} · {img.category}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>

          <div className="mx-auto mt-8 flex w-full max-w-7xl items-center gap-4 px-8 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            <span>Scroll</span>
            <div className="h-px flex-1 bg-line">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-accent" />
            </div>
            <span className="tabular-nums">{pad(items.length)} highlights</span>
          </div>
        </div>
      </div>

      {/* Mobile & tablet: swipeable strip */}
      <Reveal className="lg:hidden mt-12">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:px-6 pb-2 [scrollbar-width:none]">
          {items.map((img, i) => (
            <li key={img.id} className="snap-start shrink-0">
              <button onClick={() => onOpen(i)} className="relative block h-80 w-64 overflow-hidden bg-surface">
                <Image src={img.url} alt={img.caption || `${img.category} photo`} fill sizes="256px" className="object-cover" />
                <span className="absolute left-2.5 top-2.5 bg-canvas px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                  {pad(i + 1)} · {img.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}

/* ——— Masonry tile ——— */
function GalleryTile({ img, index, onOpen }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      layout
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)", transition: { duration: 0.25 } }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE }}
      className="mb-4 break-inside-avoid"
    >
      <button
        onClick={onOpen}
        className={`group relative block w-full overflow-hidden bg-surface ${loaded ? "" : "animate-pulse"} ${SHAPES[index % SHAPES.length]}`}
        aria-label={`Open ${img.caption || img.category + " photo"}`}
      >
        <Image
          src={img.url}
          alt={img.caption || `${img.category} photo`}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-[transform,opacity] duration-[1.2s] ${loaded ? "opacity-100" : "opacity-0"} ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]`}
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-canvas text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <BsArrowsFullscreen className="text-xs" />
        </span>
        {/* Caption slides up on hover */}
        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 bg-linear-to-t from-primary/85 to-transparent p-4 pt-10 text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
          <span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-accent">{img.category}</span>
            {img.caption && <span className="mt-1 block text-sm text-white">{img.caption}</span>}
          </span>
          <span className="text-[10px] tabular-nums text-white/60">{pad(index + 1)}</span>
        </span>
      </button>
    </motion.div>
  );
}

/* ——— Lightbox ——— */
function Lightbox({ list, index, onIndex, onClose }) {
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
          <span className="ml-4 text-accent">{img.category}</span>
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
            <Image src={img.url} alt={img.caption || `${img.category} photo`} fill sizes="90vw" className="object-contain pointer-events-none" />
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
