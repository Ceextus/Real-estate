"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";

// Counts from 0 to `value` the first time it scrolls into view, slowing as it lands.
export function CountUp({ value, duration = 1.8, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = value.toLocaleString();
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, delay, reduce]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

// Small bar chart whose bars grow up from the baseline one after another.
// `bars` are heights from 0 to 1; `highlight` is the index drawn in the accent colour.
export function MiniBars({ bars, highlight, delay = 0, className }) {
  const reduce = useReducedMotion();
  return (
    <div className={`flex h-10 items-end gap-1 ${className ?? ""}`}>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          initial={reduce ? { opacity: 0 } : { scaleY: 0 }}
          whileInView={reduce ? { opacity: 1 } : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: delay + i * 0.04, ease: EASE }}
          style={{ height: `${Math.max(h, 0.08) * 100}%` }}
          className={`flex-1 origin-bottom ${
            i === highlight ? "bg-accent" : "bg-primary/12"
          }`}
        />
      ))}
    </div>
  );
}
