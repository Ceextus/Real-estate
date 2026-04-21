"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BsFacebook,
  BsTwitterX,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";

import Image from "next/image";

const socialIcons = {
  facebook: BsFacebook,
  twitter: BsTwitterX,
  instagram: BsInstagram,
  linkedin: BsLinkedin,
};

export default function Footer() {
  const [socials, setSocials] = useState({
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("contact")
        .eq("id", 1)
        .single();

      if (data?.contact?.socials) {
        setSocials(data.contact.socials);
      }
    };
    load();
  }, []);

  const socialEntries = Object.entries(socials).filter(([, url]) => url);

  return (
    <footer className="bg-primary pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative h-16 w-56 lg:h-20 lg:w-64 mb-2">
            <Image
              src="/logo.png"
              alt="Andreams Homes Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Center Text */}
        <p className="text-[#8A96B0] text-center max-w-lg mb-2 font-medium text-lg leading-relaxed">
          Real Estate Developers, Consultancy and Valuers
        </p>
        <p className="text-[#8A96B0]/60 text-center text-sm mb-8 font-medium tracking-wide">
          WE BUILD · SELL · MANAGE · VALUE PROPERTIES &nbsp;|&nbsp; RC: 1146437
        </p>

        {/* Social Media Icons */}
        <div className="flex gap-6 mb-16">
          {socialEntries.map(([platform, url]) => {
            const Icon = socialIcons[platform];
            if (!Icon) return null;
            return (
              <Link
                key={platform}
                href={url || "#"}
                target={url && url !== "#" ? "_blank" : undefined}
                rel={url && url !== "#" ? "noopener noreferrer" : undefined}
                className="text-white hover:text-accent transition-all hover:scale-110"
              >
                <Icon className="text-[1.35rem]" />
              </Link>
            );
          })}
        </div>
        {/* Payment Options & Subsidiary */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Payment Options */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Payment Options</h3>
            <ul className="text-white/60 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Outright Full Payment (attracts 5% discount)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Down Payment: 40%
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Installmental: 50%, 30% &amp; 20% within 1 year
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                Registration Fee: ₦10,000
              </li>
            </ul>
          </div>

          {/* Subsidiary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Subsidiary Company</h3>
            <p className="text-white/70 text-sm font-medium mb-3">
              Andreams Global Sanitation Services Ltd (AGSS)
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full border border-accent/30">
                Crystal Fresh — Liquid Soap &amp; Disinfectants
              </span>
              <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full border border-accent/30">
                Stainless — Whitener &amp; Disinfectants
              </span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-white/20 mb-8" />

        {/* Bottom Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 sm:gap-x-8 md:gap-x-12 text-white/90 text-sm font-medium tracking-wide">
          <Link href="/" className="hover:text-accent transition-colors">
            HOME
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            ABOUT
          </Link>
          <Link
            href="/properties"
            className="hover:text-accent transition-colors"
          >
            PROPERTIES
          </Link>
          <Link href="/blog" className="hover:text-accent transition-colors">
            BLOG
          </Link>
          <Link href="/gallery" className="hover:text-accent transition-colors">
            GALLERY
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            CONTACT
          </Link>
          <Link href="/admin" className="hover:text-accent transition-colors">
            ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
