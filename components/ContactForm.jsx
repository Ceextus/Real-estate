"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BsArrowUpRight, BsCheckLg } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { EASE } from "@/components/motion/Reveal";

const interestLabels = {
  buy: "Buying a Property",
  build: "Building from Scratch",
  invest: "Investment Opportunities",
  consultation: "General Consultation",
};

const empty = { name: "", email: "", phone: "", interest: "buy", message: "" };

// Underline-style field: label sits above, the rule turns gold on focus.
function Field({ label, id, as = "input", ...props }) {
  const Tag = as;
  return (
    <div className="group">
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors group-focus-within:text-accent">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        {...props}
        className="mt-2 w-full resize-none border-0 border-b border-line bg-transparent pb-3 pt-1 text-base text-primary placeholder:text-ink-soft/50 outline-none transition-colors duration-300 focus:border-accent"
      />
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState(empty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      interest: formData.interest,
      subject: `${interestLabels[formData.interest]} — ${formData.name}`,
      message: formData.message,
      status: "unread",
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitStatus("error");
    } else {
      setSubmitStatus("success");
      setFormData(empty);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative overflow-hidden border border-line bg-white p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {submitStatus === "success" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-120 flex-col items-start justify-center"
            role="status"
          >
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="flex h-14 w-14 items-center justify-center bg-accent text-white"
            >
              <BsCheckLg className="text-2xl" />
            </motion.span>
            <p className="mt-8 font-display font-bold text-4xl leading-tight text-primary">
              Thank you! Your message has been sent successfully.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Our team will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitStatus(null)}
              className="mt-8 border border-primary/20 px-5 py-3 text-sm text-primary transition-colors hover:border-primary/50"
            >
              Send another message
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
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-accent">Send us a message</p>
            <p className="mt-3 text-sm text-ink-soft">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {/* Interest chips */}
            <fieldset className="mt-8">
              <legend className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">I am interested in</legend>
              <LayoutGroup id="interest">
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(interestLabels).map(([value, label]) => {
                    const active = formData.interest === value;
                    return (
                      <label
                        key={value}
                        className={`relative cursor-pointer border px-4 py-2.5 text-[13px] transition-colors duration-300 has-focus-visible:ring-2 has-focus-visible:ring-accent/60 ${
                          active ? "border-primary text-white" : "border-line text-primary hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={value}
                          checked={active}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {active && (
                          <motion.span
                            layoutId="interest-fill"
                            transition={{ duration: 0.45, ease: EASE }}
                            className="absolute inset-0 bg-primary"
                          />
                        )}
                        <span className="relative">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </LayoutGroup>
            </fieldset>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <Field label="Full name" id="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
              <Field label="Email address" id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              <Field label="Phone number" id="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+234 …" />
              <div className="md:col-span-2">
                <Field
                  label="Your message"
                  id="message"
                  as="textarea"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you…"
                />
              </div>
            </div>

            <AnimatePresence>
              {submitStatus === "error" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="mt-6 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-10 inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-primary px-7 py-4 text-sm text-white transition-colors duration-300 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending…
                </>
              ) : (
                <>
                  Send message
                  <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
