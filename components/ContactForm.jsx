"use client";

import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "buy",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const interestLabels = {
    buy: "Buying a Property",
    build: "Building from Scratch",
    invest: "Investment Opportunities",
    consultation: "General Consultation",
  };

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
      setFormData({ name: "", email: "", phone: "", interest: "buy", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white/5 rounded-4xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
      
      <div className="mb-10 text-center">
        <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Send us a Message</h3>
        <p className="text-white/60 text-sm">Fill out the form below and our team will get back to you within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="john@example.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              placeholder="+234 ..." />
          </div>
          <div>
            <label htmlFor="interest" className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">I am interested in</label>
            <select id="interest" name="interest" value={formData.interest} onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all appearance-none cursor-pointer">
              <option className="bg-primary text-white" value="buy">Buying a Property</option>
              <option className="bg-primary text-white" value="build">Building from Scratch</option>
              <option className="bg-primary text-white" value="invest">Investment Opportunities</option>
              <option className="bg-primary text-white" value="consultation">General Consultation</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 ml-1">Your Message</label>
          <textarea id="message" name="message" required rows="4" value={formData.message} onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
            placeholder="Tell us how we can help you..."></textarea>
        </div>

        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
            Thank you! Your message has been sent successfully.
          </div>
        )}
        {submitStatus === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
            Something went wrong. Please try again.
          </div>
        )}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-accent hover:bg-white hover:text-primary text-white px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed border border-transparent">
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              Send Message
              <BsArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
