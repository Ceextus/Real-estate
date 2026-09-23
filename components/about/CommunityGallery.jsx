"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";
import Lightbox from "@/components/Lightbox";

const EVENT = "Andreams Annual Humanitarian Service";

// Every photo here is from the same event; captions describe what each one shows.
const photos = [
  { url: "/images/emp4.jpg", caption: "Beneficiaries celebrating at the widows empowerment programme" },
  { url: "/images/emp5.jpg", caption: "Relief packages being handed out" },
  { url: "/images/emp3.jpg", caption: "Food supplies ready for distribution" },
  { url: "/images/emp2.jpg", caption: "The Andreams team on the grounds" },
  { url: "/images/emp1.jpg", caption: "Hundreds gathered for the programme" },
  { url: "/images/csr-jamb-empowerment.jpg", caption: "Speaking to the press at the event" },
  { url: "/images/csr-widows-programme.jpg", caption: "Widows and families waiting for support" },
  { url: "/images/csr-sports-tournament.jpg", caption: "The crowd at the humanitarian service" },
].map((p, i) => ({ ...p, id: p.url, label: EVENT, index: i }));

const VISIBLE = 5;

export default function CommunityGallery() {
  const [viewer, setViewer] = useState(null);
  const reduce = useReducedMotion();
  const extra = photos.length - VISIBLE;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 aspect-2/1">
        {photos.slice(0, VISIBLE).map((p, i) => {
          const isLast = i === VISIBLE - 1 && extra > 0;
          return (
            <motion.button
              key={p.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
              onClick={() => setViewer(i)}
              aria-label={isLast ? `View all ${photos.length} photos` : `Open photo: ${p.caption}`}
              className={`group relative overflow-hidden bg-surface ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <Image
                src={p.url}
                alt={p.caption}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 15vw, 25vw"}
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              {i === 0 && (
                <span className="absolute inset-x-0 bottom-0 hidden sm:block bg-linear-to-t from-primary/80 to-transparent p-4 pt-12 text-left text-sm text-white">
                  {p.caption}
                </span>
              )}
              {isLast && (
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-primary/70 text-white transition-colors group-hover:bg-primary/80">
                  <span className="text-2xl font-semibold">+{extra}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">View all</span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {viewer !== null && (
          <Lightbox list={photos} index={viewer} onIndex={setViewer} onClose={() => setViewer(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
