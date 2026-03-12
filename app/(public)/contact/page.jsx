"use client";

import { useState, useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { BsClock } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("contact")
        .eq("id", 1)
        .single();

      if (data?.contact) {
        setContact(data.contact);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Fallback values while loading or if no data
  const phone1 = contact?.phone1 || "+234 812 345 6789";
  const phone2 = contact?.phone2 || "";
  const emailSupport = contact?.email_support || "info@andreamhomes.com";
  const emailInquiry = contact?.email_inquiry || "sales@andreamhomes.com";
  const address = contact?.address || "12, Andream Homes Avenue, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria.";

  // Use custom Google Maps embed URL from admin settings, or fall back to a default
  const mapSrc = contact?.map_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6062758415715!2d3.407982274992389!3d6.444598593544975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2dfbc2ba21%3A0xe67598ac80211fc5!2sLekki%20Phase%201%2C%20Lagos!5e0!3m2!1sen!2sng!4v1711200000000!5m2!1sen!2sng";

  return (
    <main className="min-h-screen bg-primary pt-16 pb-24 selection:bg-accent selection:text-white">
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-accent"></span>
          Get in Touch
          <span className="w-8 h-px bg-accent"></span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          Let&apos;s Build Your <br className="hidden sm:block" /> Dream Home
        </h1>
        <p className="max-w-2xl mx-auto text-white/70 text-lg">
          Whether you&apos;re looking to invest, buy a new property, or start a construction project from scratch, our team of experts is here to help.
        </p>
      </section>

      {/* Main Content: Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10 lg:pr-10">
            
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-colors backdrop-blur-sm">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent text-2xl border border-accent/20">
                <HiOutlineLocationMarker />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Head Office</h3>
              <p className="text-white/70 leading-relaxed font-medium">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  address.split(",").map((part, i, arr) => (
                    <span key={i}>
                      {part.trim()}
                      {i < arr.length - 1 && <>,<br /></>}
                    </span>
                  ))
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-colors backdrop-blur-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white text-xl">
                  <HiOutlinePhone />
                </div>
                <h3 className="font-bold text-white mb-2">Call Us</h3>
                <div className="text-white/70 text-sm font-medium space-y-1">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <a href={`tel:${phone1.replace(/\s/g, "")}`} className="block hover:text-accent transition-colors">{phone1}</a>
                      {phone2 && <a href={`tel:${phone2.replace(/\s/g, "")}`} className="block hover:text-accent transition-colors">{phone2}</a>}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-colors backdrop-blur-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white text-xl">
                  <HiOutlineMail />
                </div>
                <h3 className="font-bold text-white mb-2">Email Us</h3>
                <div className="text-white/70 text-sm font-medium space-y-1">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <a href={`mailto:${emailSupport}`} className="block hover:text-accent transition-colors">{emailSupport}</a>
                      {emailInquiry && emailInquiry !== emailSupport && (
                        <a href={`mailto:${emailInquiry}`} className="block hover:text-accent transition-colors">{emailInquiry}</a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-black/40 border border-white/10 text-white rounded-3xl shadow-lg backdrop-blur-sm">
              <div className="text-3xl text-accent"><BsClock /></div>
              <div>
                <h3 className="font-bold mb-1">Business Hours</h3>
                <p className="text-white/80 text-sm">Monday - Friday: 8:00 AM - 6:00 PM<br/>Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative group">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </div>
      </section>

    </main>
  );
}
