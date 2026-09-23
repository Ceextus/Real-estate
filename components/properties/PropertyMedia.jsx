"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BsGrid3X3Gap } from "react-icons/bs";
import { EASE } from "@/components/motion/Reveal";
import Lightbox from "@/components/Lightbox";

// Mosaic of the main photo plus up to two more; every tile opens the full-screen viewer.
export default function PropertyMedia({ images, title, status }) {
  const [viewer, setViewer] = useState(null);
  const reduce = useReducedMotion();
  const list = images.map((url, i) => ({ id: `${i}-${url}`, url, label: title }));
  const side = images.slice(1, 3);

  const tile = (i) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(12px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 1.1, delay: 0.3 + i * 0.12, ease: EASE },
  });

  if (images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-2 ${side.length ? "lg:grid-cols-12" : ""}`}>
        <motion.button
          {...tile(0)}
          onClick={() => setViewer(0)}
          className={`group relative block overflow-hidden bg-surface h-[46vh] min-h-80 lg:h-[62vh] lg:max-h-160 ${
            side.length ? "lg:col-span-8" : ""
          }`}
          aria-label="Open photo 1"
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {status && (
            <span className="absolute left-4 top-4 bg-canvas px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-primary">
              {status}
            </span>
          )}
        </motion.button>

        {side.length > 0 && (
          <div className={`hidden lg:grid lg:col-span-4 gap-2 ${side.length === 2 ? "grid-rows-2" : ""}`}>
            {side.map((url, i) => (
              <motion.button
                key={url}
                {...tile(i + 1)}
                onClick={() => setViewer(i + 1)}
                className="group relative block overflow-hidden bg-surface"
                aria-label={`Open photo ${i + 2}`}
              >
                <Image
                  src={url}
                  alt={`${title} — view ${i + 2}`}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          onClick={() => setViewer(0)}
          className="mt-3 inline-flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-[13px] text-primary transition-colors hover:border-primary/40"
        >
          <BsGrid3X3Gap className="text-xs" />
          View all {images.length} photos
        </motion.button>
      )}

      <AnimatePresence>
        {viewer !== null && (
          <Lightbox list={list} index={viewer} onIndex={setViewer} onClose={() => setViewer(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
