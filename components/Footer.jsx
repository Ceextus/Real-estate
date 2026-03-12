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

// Custom SVGs for a house logo similar to the image
const LogoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    <path
      d="M2 13.5L12 4.5L22 13.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 4.5L17 9V20H13V14H11V20H7V9L12 4.5Z" fill="currentColor" />
  </svg>
);

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
          <div className="flex items-center justify-center gap-3">
            <LogoIcon />
            <div className="font-bold text-xl tracking-wider text-white">
              ANDREAM HOMES
            </div>
          </div>
        </div>

        {/* Center Text */}
        <p className="text-[#a4b6ad] text-center max-w-lg mb-8 font-medium text-lg leading-relaxed">
          We take great pride in ensuring the satisfaction{" "}
          <br className="hidden sm:block" />
          of our customers, which
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

        {/* Divider Line */}
        <div className="w-full h-px bg-white/20 mb-8" />

        {/* Bottom Navigation Links */}
        <div className="flex flex-wrap justify-center items-center divide-x divide-white/20 text-white/90 text-[0.95rem] font-medium tracking-wide">
          <Link
            href="/"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/about"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            ABOUT
          </Link>
          <Link
            href="/properties"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            PROPERTIES
          </Link>
          <Link
            href="/gallery"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            GALLERY
          </Link>
          <Link
            href="/contact"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            CONTACT
          </Link>
          <Link
            href="/admin"
            className="px-6 md:px-12 hover:text-accent transition-colors"
          >
            ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
