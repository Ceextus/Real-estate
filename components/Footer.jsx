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
        <p className="text-[#8A96B0] text-center max-w-lg mb-8 font-medium text-lg leading-relaxed">
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
