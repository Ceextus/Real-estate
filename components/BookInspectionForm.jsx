"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function BookInspectionForm({ propertyId, propertyTitle }) {
  const [form, setForm] = useState({ name: "", phone: "", preferred_date: "" });
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

  if (submitted) {
    return (
      <div className="sticky top-28 bg-[#11241a] border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl text-center">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Tour Requested!</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Thank you, <span className="text-accent font-semibold">{form.name}</span>. We&apos;ve received your inspection request for <span className="text-white font-semibold">{propertyTitle}</span>. Our team will contact you shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", preferred_date: "" }); }}
          className="text-accent hover:text-white text-sm font-bold underline underline-offset-4 transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-28 bg-[#11241a] border border-white/10 p-8 md:p-10 rounded-[40px] shadow-2xl">
      <div className="text-center mb-10">
        <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
        <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">
          Book Inspection
        </h3>
        <p className="text-white/50 text-sm">
          Schedule a VIP tour of this property
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 ml-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-accent focus:bg-white/5 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 ml-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+234 ..."
            required
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 outline-none focus:border-accent focus:bg-white/5 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 ml-1">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferred_date"
            value={form.preferred_date}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white/80 outline-none focus:border-accent focus:bg-white/5 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-white font-bold text-sm tracking-wider uppercase py-5 rounded-2xl hover:bg-white hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(224,155,107,0.2)] hover:shadow-[0_0_30px_rgba(224,155,107,0.4)] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Request Tour Schedule"}
        </button>
      </form>
    </div>
  );
}
