"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsArrowUpRight, BsCheckLg } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { EASE } from "@/components/motion/Reveal";

const empty = { name: "", phone: "", preferred_date: "" };

function Field({ label, id, ...props }) {
  return (
    <div className="group">
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors group-focus-within:text-accent">
        {label}
      </label>
      <input
        id={id}
        name={id}
        {...props}
        className="mt-2 w-full border-0 border-b border-line bg-transparent pb-3 pt-1 text-base text-primary placeholder:text-ink-soft/50 outline-none transition-colors duration-300 focus:border-accent"
      />
    </div>
  );
}

export default function BookInspectionForm({ propertyId, propertyTitle }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please fill in your name and phone number.");
      return;
    }

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("inspections").insert({
      property_id: propertyId,
      property_title: propertyTitle,
      name: form.name.trim(),
      phone: form.phone.trim(),
      preferred_date: form.preferred_date || null,
    });

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          role="status"
        >
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="flex h-12 w-12 items-center justify-center bg-accent text-white"
          >
            <BsCheckLg className="text-xl" />
          </motion.span>
          <p className="mt-6 font-display font-bold text-3xl leading-tight text-primary">Tour requested!</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Thank you, <span className="text-primary">{form.name}</span>. We&apos;ve received
            your inspection request for <span className="text-primary">{propertyTitle}</span>.
            Our team will contact you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(empty);
            }}
            className="mt-6 border border-primary/20 px-4 py-2.5 text-[13px] text-primary transition-colors hover:border-primary/50"
          >
            Submit another request
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="space-y-7"
        >
          <Field label="Full name" id="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          <Field label="Phone number" id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 …" required />
          <Field label="Preferred date" id="preferred_date" type="date" value={form.preferred_date} onChange={handleChange} />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex w-full items-center justify-center gap-3 bg-primary px-6 py-4 text-sm text-white transition-colors duration-300 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </>
            ) : (
              <>
                Request tour schedule
                <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
