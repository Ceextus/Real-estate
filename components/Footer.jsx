import Image from "next/image";
import Link from "next/link";
import { BsFacebook, BsTwitterX, BsInstagram, BsLinkedin, BsArrowUpRight } from "react-icons/bs";
import { createStaticClient } from "@/utils/supabase/static";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { displayPhone, telPhone } from "@/lib/format";

const socialIcons = {
  facebook: { icon: BsFacebook, label: "Facebook" },
  instagram: { icon: BsInstagram, label: "Instagram" },
  twitter: { icon: BsTwitterX, label: "X" },
  linkedin: { icon: BsLinkedin, label: "LinkedIn" },
};

const explore = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Properties", href: "/properties" },
  // { name: "Blog", href: "/blog" }, // Blog hidden for now
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
];

const paymentOptions = [
  "Outright Full Payment (attracts 5% discount)",
  "Down Payment: 40%",
  "Installmental: 50%, 30% & 20% within 1 year",
  "Registration Fee: ₦10,000",
];

// Contact details and social links are managed in Admin → Settings.
async function getContact() {
  try {
    const { data } = await createStaticClient()
      .from("site_settings")
      .select("contact")
      .eq("id", 1)
      .single();
    return data?.contact ?? {};
  } catch {
    return {};
  }
}


function ColumnTitle({ children }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">{children}</p>
  );
}

export default async function Footer() {
  const contact = await getContact();
  const phones = [...new Set([contact.phone1, contact.phone2].filter(Boolean))];
  const emails = [...new Set([contact.email_support, contact.email_inquiry].filter(Boolean))];
  const socials = Object.entries(contact.socials ?? {}).filter(
    ([platform, url]) => url && url !== "#" && socialIcons[platform]
  );

  return (
    <footer className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Closing statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 md:py-20 items-end border-b border-white/10">
          <div className="lg:col-span-8">
            <WordReveal
              as="p"
              lines={[
                "Real estate developers,",
                { text: "consultancy and valuers.", accent: ["valuers."] },
              ]}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-white"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm text-primary transition-colors duration-300 hover:bg-secondary"
            >
              Talk to us
              <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-14">
          <Reveal className="lg:col-span-4">
            <Link href="/" className="relative block h-16 w-16">
              <Image src="/logo.png" alt="Andreams Homes Logo" fill sizes="64px" className="object-contain object-left" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              We build · Sell · Manage · Value properties
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socials.map(([platform, url]) => {
                  const { icon: Icon, label } = socialIcons[platform];
                  return (
                    <li key={platform}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-primary"
                      >
                        <Icon className="text-base" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-2">
            <ColumnTitle>Explore</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/75 transition-colors hover:text-accent">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="mt-4 space-y-2.5 text-sm">
              {emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="break-all text-white/75 transition-colors hover:text-accent">
                    {e}
                  </a>
                </li>
              ))}
              {phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${telPhone(p)}`} className="text-white/75 transition-colors hover:text-accent">
                    {displayPhone(p)}
                  </a>
                </li>
              ))}
              {contact.address && (
                <li className="max-w-60 leading-relaxed text-white/50">{contact.address}</li>
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-3">
            <ColumnTitle>Payment options</ColumnTitle>
            <ul className="mt-4 space-y-2.5">
              {paymentOptions.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-white/75">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Subsidiary */}
        {/* <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-t border-white/10 py-6 text-sm">
          <ColumnTitle>Subsidiary company</ColumnTitle>
          <p className="text-white/75">Andreams Global Sanitation Services Ltd (AGSS)</p>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            <span className="border border-white/10 px-2.5 py-1 text-xs text-white/50">
              Crystal Fresh — Liquid Soap &amp; Disinfectants
            </span>
            <span className="border border-white/10 px-2.5 py-1 text-xs text-white/50">
              Stainless — Whitener &amp; Disinfectants
            </span>
          </div>
        </div> */}

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Andreams Global Properties Ltd · RC: 11464337
          </p>
          <Link href="/admin" className="transition-colors hover:text-white">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
