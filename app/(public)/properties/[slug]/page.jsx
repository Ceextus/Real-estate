import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createStaticClient } from "@/utils/supabase/static";
import {
  HiOutlineLocationMarker,
  HiOutlineCheck,
  HiArrowLeft,
} from "react-icons/hi";
import BookInspectionForm from "@/components/BookInspectionForm";
import PropertyGallery from "@/components/PropertyGallery";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.andreamshomes.com";

// ─── Static Generation ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: properties } = await supabase.from("properties").select("slug");
  return (properties || []).map((p) => ({ slug: p.slug }));
}

// ─── Dynamic Metadata ───────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("title, location, price, type, description, image, beds")
    .eq("slug", slug)
    .single();

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }

  const title = `${property.title} in ${property.location} for Sale`;

  // Build a concise 150-155 char description
  const baseDesc = `${property.type} in ${property.location}. ${
    property.beds ? property.beds + ". " : ""
  }Asking ${property.price}.`;
  const extra = property.description
    ? " " +
      property.description.slice(0, Math.max(0, 155 - baseDesc.length - 1))
    : "";
  const description = (baseDesc + extra).trim().slice(0, 160);

  const ogImage = property.image || "/og-default.jpg";
  const canonicalUrl = `${siteUrl}/properties/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${property.title} — ${property.location}`,
        },
      ],
      siteName: "Andreams Homes",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default async function PropertyDetails({ params }) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!property) {
    notFound();
  }

  // ─── Fetch Related Properties (same location, different slug) ────────────
  const { data: relatedProperties } = await supabase
    .from("properties")
    .select("slug, title, image, location, price, type")
    .neq("slug", slug)
    .limit(3);

  // ─── JSON-LD: Product + Offer + RealEstateListing ────────────────────────
  const allImages = [property.image, ...(property.images || [])].filter(
    Boolean,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Product", "RealEstateListing"],
    name: property.title,
    description: property.description,
    url: `${siteUrl}/properties/${slug}`,
    image: allImages,
    datePosted: property.created_at,
    brand: {
      "@type": "Organization",
      name: "Andreams Homes",
    },
    offers: {
      "@type": "Offer",
      price: property.price?.replace(/[^0-9.]/g, "") || undefined,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Andreams Homes",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "NG",
    },
    additionalProperty: [
      property.beds
        ? { "@type": "PropertyValue", name: "Bedrooms", value: property.beds }
        : null,
      property.size
        ? { "@type": "PropertyValue", name: "Size", value: property.size }
        : null,
      property.status
        ? { "@type": "PropertyValue", name: "Status", value: property.status }
        : null,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-primary overflow-hidden selection:bg-accent selection:text-white">
        {/* Full-Bleed Hero Banner */}
        <section className="relative w-full h-[55vh] md:h-[70vh]">
          <Image
            src={property.image}
            alt={`${property.title} — ${property.type} for sale in ${property.location}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

          {/* Back button overlay */}
          <div className="absolute top-24 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/properties"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                  <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-sm font-medium tracking-wide">
                  Back to Properties
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom curved edge */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 60V30C360 0 1080 0 1440 30V60H0Z" fill="#0a0a0a"/>
            </svg>
          </div>
        </section>

        {/* Project Title + Overview Section */}
        <section className="bg-primary relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Project Label */}
            <p className="text-accent text-sm font-bold tracking-widest uppercase mb-3">Project</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <span className="flex items-center text-white/60 text-sm font-medium">
                <HiOutlineLocationMarker className="mr-1.5 text-accent text-lg" />
                {property.location}
              </span>
              {property.property_type && (
                <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full border border-accent/20">
                  {property.property_type}
                </span>
              )}
              {property.status && (
                <span className="bg-white/10 text-white/70 text-xs font-bold px-3 py-1 rounded-full">
                  {property.status}
                </span>
              )}
            </div>

            {/* Description + Secondary Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Description */}
              <div>
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  {property.description}
                </p>

                {/* Developer & Supported By badges */}
                {(property.developer || property.supported_by) && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {property.developer && (
                      <span className="bg-accent/10 text-accent text-xs font-bold px-4 py-2 rounded-full border border-accent/20">
                        Developer: {property.developer}
                      </span>
                    )}
                    {property.supported_by && (
                      <span className="bg-white/10 text-white/70 text-xs font-bold px-4 py-2 rounded-full border border-white/10">
                        Supported by: {property.supported_by}
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {property.beds && (
                    <div className="border-l-2 border-accent pl-4">
                      <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Type</p>
                      <p className="text-white font-bold">{property.beds}</p>
                    </div>
                  )}
                  {property.size && (
                    <div className="border-l-2 border-white/10 pl-4">
                      <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Size</p>
                      <p className="text-white font-bold">{property.size}</p>
                    </div>
                  )}
                  <div className="border-l-2 border-accent pl-4">
                    <p className="text-white/50 text-xs tracking-wider uppercase mb-1">Price</p>
                    <p className="text-accent font-extrabold text-lg">{property.price}</p>
                  </div>
                </div>
              </div>

              {/* Right: Secondary Image or Map */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-[350px] lg:h-[400px]">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={`${property.title} — detail view`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-primary" />
                    <iframe
                      src={
                        property.map_embed ||
                        `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d7.5!3d9.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAbuja!5e0!3m2!1sen!2sng!4v1711200000000!5m2!1sen!2sng`
                      }
                      title={`Map — ${property.title}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 z-0"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Property Gallery */}
        {property.images && property.images.length > 0 && (
          <PropertyGallery images={property.images} title={property.title} />
        )}

        {/* Map Section (always show if images exist — map wasn't shown above) */}
        {property.images && property.images.length > 0 && (
          <section className="bg-primary border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-accent inline-block"></span>
                Location Map
              </h2>
              <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-sm">
                <iframe
                  src={
                    property.map_embed ||
                    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d7.5!3d9.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAbuja!5e0!3m2!1sen!2sng!4v1711200000000!5m2!1sen!2sng`
                  }
                  title={`Map — ${property.title} in ${property.location}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        )}

          {/* Video Tour (YouTube Embed) */}
          {property.video_placeholder &&
            (() => {
              const getYouTubeEmbedUrl = (url) => {
                if (!url) return null;
                let videoId = null;
                const watchMatch = url.match(
                  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                );
                if (watchMatch) videoId = watchMatch[1];
                if (!videoId) {
                  const shortMatch = url.match(
                    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                  );
                  if (shortMatch) videoId = shortMatch[1];
                }
                if (!videoId) {
                  const embedMatch = url.match(
                    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                  );
                  if (embedMatch) videoId = embedMatch[1];
                }
                return videoId
                  ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1`
                  : null;
              };

              const embedUrl = getYouTubeEmbedUrl(property.video_placeholder);
              if (!embedUrl) return null;

              return (
                <section className="bg-primary">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="w-6 h-[2px] bg-accent inline-block"></span>
                      Video Tour
                    </h2>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
                      <iframe
                        src={embedUrl}
                        title={`${property.title} - Video Tour`}
                        width="100%"
                        height="100%"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                </section>
              );
            })()}

        {/* Details & Booking Section */}
        <section className="bg-primary pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Key Features & Amenities
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      {property.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-white/80 text-sm">
                          <HiOutlineCheck className="text-accent text-lg shrink-0 mr-3 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Plot Types Table */}
                {property.plot_types && property.plot_types.length > 0 && property.plot_types.some(p => p.type) && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Plot Types & Pricing
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-white/50 uppercase text-xs tracking-wider">
                            <th className="pb-3 pr-4">Type</th>
                            <th className="pb-3 pr-4">Size</th>
                            <th className="pb-3 pr-4">Units</th>
                            <th className="pb-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.plot_types.filter(p => p.type).map((plot, idx) => (
                            <tr key={idx} className="border-b border-white/5">
                              <td className="py-3 pr-4 text-white/80 font-medium">{plot.type}</td>
                              <td className="py-3 pr-4 text-white/60">{plot.size}</td>
                              <td className="py-3 pr-4 text-white/60">{plot.units}</td>
                              <td className="py-3 text-accent font-bold">{plot.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {property.registration_fee && (
                      <p className="text-white/40 text-xs mt-4 font-medium">
                        Registration Fee: <span className="text-accent">{property.registration_fee}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Service Plots Table */}
                {property.service_plots && property.service_plots.length > 0 && property.service_plots.some(s => s.size) && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Service Plots
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400 uppercase text-xs tracking-wider">
                            <th className="pb-3 pr-4">Size</th>
                            <th className="pb-3 pr-4">House Type</th>
                            <th className="pb-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {property.service_plots.filter(s => s.size).map((sp, idx) => (
                            <tr key={idx} className="border-b border-white/5">
                              <td className="py-3 pr-4 text-white/80 font-medium">{sp.size}</td>
                              <td className="py-3 pr-4 text-white/60">{sp.house_type}</td>
                              <td className="py-3 text-accent font-bold">{sp.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Payment Options */}
                {property.payment_options && property.payment_options.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Payment Options
                    </h4>
                    <ul className="space-y-3">
                      {property.payment_options.map((option, idx) => (
                        <li key={idx} className="flex items-center text-white/80 text-sm">
                          <span className="w-2 h-2 rounded-full bg-accent shrink-0 mr-3" />
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bank Details */}
                {property.bank_details && property.bank_details.length > 0 && property.bank_details.some(b => b.bank) && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Bank Details for Payment
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.bank_details.filter(b => b.bank).map((bd, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <p className="text-accent font-bold text-sm mb-2">{bd.bank}</p>
                          <p className="text-white/70 text-sm">{bd.account_name}</p>
                          <p className="text-white font-mono text-lg font-bold mt-1">{bd.account_no}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities */}
                {property.facilities && property.facilities.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                      Standard Estate Facilities
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {property.facilities.map((facility, idx) => (
                        <div key={idx} className="flex items-center text-white/70 text-sm">
                          <HiOutlineCheck className="text-accent shrink-0 mr-2" />
                          {facility}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Book Inspection Form */}
              <div className="lg:col-span-5">
                <BookInspectionForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Related Properties */}
        {relatedProperties && relatedProperties.length > 0 && (
          <section className="bg-primary border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-accent inline-block"></span>
                SIMILAR PROPERTIES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProperties.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/properties/${related.slug}`}
                    className="group block bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all hover:shadow-lg"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={`${related.title} — ${related.type} in ${related.location}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                        <HiOutlineLocationMarker className="text-accent" />
                        {related.location}
                      </p>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {related.title}
                      </h3>
                      <p className="text-accent font-bold">{related.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
