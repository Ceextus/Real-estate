"use client";

import { motion, useReducedMotion } from "framer-motion";

// Shared motion language for the redesign: content eases up out of a soft blur.
export const EASE = [0.22, 1, 0.36, 1];

// Fades a block in from blur + a small upward offset, either on mount or when scrolled into view.
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  blur = 12,
  duration = 0.9,
  onMount = false,
  className,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, y, filter: `blur(${blur}px)` };
  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
  const trigger = onMount
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, amount: 0.3 } };

  return (
    <Tag
      initial={hidden}
      {...trigger}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Splits a line of text into words that blur in one after another.
// `lines` is an array of strings or { text, className, accent } objects, each rendered on its own line.
// `accent` is a list of words in that line to colour with `accentClass`.
export function WordReveal({
  lines,
  as = "h2",
  delay = 0,
  stagger = 0.08,
  onMount = false,
  accentClass = "text-accent",
  className,
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.h2;
  const trigger = onMount
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, amount: 0.5 } };

  const word = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: "0.35em", filter: "blur(10px)" },
    shown: reduce
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: "0em",
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE },
        },
  };

  let index = 0;
  return (
    <Tag
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {lines.map((line, i) => {
        const { text, className: lineClass, accent = [] } =
          typeof line === "string" ? { text: line } : line;
        return (
          <span key={i} className={`block ${lineClass ?? ""}`}>
            {text.split(" ").map((w) => (
              <motion.span
                key={index++}
                variants={word}
                className={`inline-block will-change-[transform,filter] mr-[0.22em] last:mr-0 ${
                  accent.includes(w) ? accentClass : ""
                }`}
              >
                {w}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
