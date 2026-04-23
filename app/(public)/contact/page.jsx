import ContactForm from "@/components/ContactForm";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { BsClock } from "react-icons/bs";
import { createClient } from "@/utils/supabase/server";

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

  const addressParts = address.split(",");

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            Whether you&apos;re looking to invest, buy a new property, or start
            a construction project from scratch, our team of experts is here to
            help.
          </p>
        </section>

        {/* Main Content: Info & Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Left Column: Contact Information */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:pr-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-white/70 text-lg">
                  Reach out to us directly through any of the channels below.
                </p>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent text-2xl flex-shrink-0 border border-white/10">
                  <HiOutlineLocationMarker />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Head Office
                  </h3>
                  <address className="text-white/70 leading-relaxed not-italic">
                    {addressParts.map((part, i) => (
                      <span key={i}>
                        {part.trim()}
                        {i < addressParts.length - 1 && (
                          <>
                            ,<br />
                          </>
                        )}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent text-xl flex-shrink-0 border border-white/10">
                  <HiOutlinePhone />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
                  <div className="text-white/70 space-y-1">
                    <a
                      href={`tel:${phone1.replace(/\s/g, "")}`}
                      className="block hover:text-accent transition-colors"
                    >
                      {phone1}
                    </a>
                    {phone2 && (
                      <a
                        href={`tel:${phone2.replace(/\s/g, "")}`}
                        className="block hover:text-accent transition-colors"
                      >
                        {phone2}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent text-xl flex-shrink-0 border border-white/10">
                  <HiOutlineMail />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                  <div className="text-white/70 space-y-1 overflow-hidden">
                    <a
                      href={`mailto:${emailSupport}`}
                      className="block hover:text-accent transition-colors truncate"
                      title={emailSupport}
                    >
                      {emailSupport}
                    </a>
                    {emailInquiry && emailInquiry !== emailSupport && (
                      <a
                        href={`mailto:${emailInquiry}`}
                        className="block hover:text-accent transition-colors truncate"
                        title={emailInquiry}
                      >
                        {emailInquiry}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent text-xl flex-shrink-0 border border-white/10">
                  <BsClock />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Business Hours</h3>
                  <p className="text-white/70">
                    Mon - Fri: 8:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (client component) */}
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
              title="Andreams Homes Office Location — Asokoro, Abuja"
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
    </>
  );
}
