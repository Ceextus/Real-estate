import ContactForm from "@/components/ContactForm";
import { BsArrowUpRight } from "react-icons/bs";
import { createClient } from "@/utils/supabase/server";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { displayPhone, telPhone } from "@/lib/format";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.andreamshomes.com";

export const metadata = {
  title: "Contact Us — Get in Touch with Andreamss Homes",
  description:
    "Get in touch with Andreams Homes. Visit our Abuja office, call us, or send a message. Our real estate experts are ready to help you find the perfect luxury property.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Andreams Homes — Luxury Real Estate Nigeria",
    description:
      "Reach our team for property enquiries, investment consultation, or inspection bookings. We're based in Asokoro, Abuja.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Andreams Homes — Luxury Real Estate Nigeria",
    description:
      "Reach our team for property enquiries, investment consultation, or inspection bookings in Abuja, Nigeria.",
  },
};

const hours = [
  { days: "Mon – Fri", time: "8:00 AM – 6:00 PM" },
  { days: "Saturday", time: "9:00 AM – 2:00 PM" },
];

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("contact")
    .eq("id", 1)
    .single();

  const contact = data?.contact || {};

  const phone1 = contact.phone1 || "+234 812 345 6789";
  const phone2 = contact.phone2 || "";
  const emailSupport = contact.email_support || "info@Andreamshomes.com";
  const emailInquiry = contact.email_inquiry || "sales@Andreamshomes.com";
  const address =
    contact.address ||
    "No 15, Hamza Abdullahi Street, Asokoro, Abuja, Nigeria.";
  const mapSrc =
    contact.map_embed ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d7.5!3d9.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAsokoro%2C%20Abuja!5e0!3m2!1sen!2sng!4v1711200000000!5m2!1sen!2sng";
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const addressParts = address.split(",");
  const phones = [...new Set([phone1, phone2].filter(Boolean))];
  const emails = [...new Set([emailSupport, emailInquiry].filter(Boolean))];

  // ─── JSON-LD: LocalBusiness ──────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Andreams Global Properties Ltd",
    alternateName: "Andreams Homes",
    description:
      "Abuja-based real estate developer offering affordable homes, serviced plots, and property investments across Abuja FCT and Lagos, Nigeria.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    telephone: phone1,
    email: emailSupport,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressParts.slice(0, -2).join(",").trim(),
      addressLocality: "Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      contact.socials?.facebook,
      contact.socials?.twitter,
      contact.socials?.instagram,
      contact.socials?.linkedin,
    ].filter(Boolean),
  };

  // Each way to reach us is one row: label, large value, arrow that nudges on hover.
  const channels = [
    ...phones.map((p) => ({ label: "Call us", value: displayPhone(p), href: `tel:${telPhone(p)}` })),
    ...emails.map((e, i) => ({
      label: i === 0 ? "Email us" : "Enquiries",
      value: e,
      href: `mailto:${e}`,
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-canvas pt-10 md:pt-16">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <Reveal onMount className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Get in Touch
            </Reveal>
            <WordReveal
              as="h1"
              onMount
              delay={0.15}
              lines={["Let's build your", { text: "dream home", accent: ["dream", "home"] }]}
              className="mt-5 font-display font-bold text-[3.25rem] sm:text-7xl lg:text-[6.5rem] leading-[0.95] tracking-tight text-primary"
            />
          </div>
          <Reveal onMount delay={0.45} className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Whether you&apos;re looking to invest, buy a new property, or start a
              construction project from scratch, our team of experts is here to
              help.
            </p>
          </Reveal>
        </section>

        {/* Channels + form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal onMount delay={0.5}>
              <p className="text-sm text-ink-soft">
                Reach out to us directly through any of the channels below.
              </p>
            </Reveal>

            <ul className="mt-6 border-t border-line">
              {channels.map((c, i) => (
                <Reveal as="li" key={c.href} onMount delay={0.55 + i * 0.07} className="border-b border-line">
                  <a href={c.href} className="group flex items-end justify-between gap-4 py-5">
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-soft">{c.label}</span>
                      <span className="mt-1.5 block truncate text-lg sm:text-xl text-primary transition-colors group-hover:text-accent">
                        {c.value}
                      </span>
                    </span>
                    <BsArrowUpRight className="mb-1.5 shrink-0 text-sm text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </a>
                </Reveal>
              ))}

              <Reveal as="li" onMount delay={0.55 + channels.length * 0.07} className="border-b border-line py-5">
                <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-soft">Head office</span>
                <address className="mt-1.5 max-w-sm not-italic text-lg leading-snug text-primary">{address}</address>
              </Reveal>

              <Reveal as="li" onMount delay={0.62 + channels.length * 0.07} className="border-b border-line py-5">
                <span className="block text-[11px] uppercase tracking-[0.16em] text-ink-soft">Business hours</span>
                <dl className="mt-2 space-y-1.5">
                  {hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 text-base">
                      <dt className="text-primary">{h.days}</dt>
                      <dd className="tabular-nums text-ink-soft">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </ul>
          </div>

          <Reveal onMount delay={0.6} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </section>

        {/* Map */}
        <section className="mt-24 md:mt-32">
          <Reveal className="group relative h-[60vh] min-h-105 max-h-160 overflow-hidden border-y border-line bg-surface">
            <iframe
              src={mapSrc}
              title="Andreams Homes Office Location — Asokoro, Abuja"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[0.85] contrast-[1.05] transition-[filter] duration-700 group-hover:grayscale-0"
            ></iframe>

            <div className="pointer-events-none absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end sm:items-center sm:justify-end pb-5 sm:pb-0">
              <div className="pointer-events-auto w-full sm:w-80 border border-line bg-canvas p-6 shadow-[0_24px_50px_-24px_rgba(11,29,58,0.45)]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Visit our head office</p>
                <p className="mt-3 font-display font-bold text-2xl leading-snug text-primary">
                  {addressParts.slice(0, 2).join(",").trim()}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{addressParts.slice(2).join(",").trim()}</p>
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/dir mt-5 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[13px] text-white transition-colors hover:bg-primary-light"
                >
                  Get directions
                  <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover/dir:translate-x-0.5 group-hover/dir:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
