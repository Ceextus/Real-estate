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
      <main className="min-h-screen bg-primary pt-24 pb-24 overflow-hidden selection:bg-accent selection:text-white">
        {/* Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
          <Link
            href="/properties"
            className="inline-flex items-center text-white/70 hover:text-accent transition-colors gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors">
              <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm font-medium tracking-wide">
              Back to Properties
            </span>
          </Link>
        </div>

        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
          <div className="w-full h-[50vh] md:h-[60vh] rounded-[30px] md:rounded-[50px] overflow-hidden relative shadow-2xl group">
            <Image
              src={property.image}
              alt={`${property.title} — ${property.type} for sale in ${property.location}`}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center text-white/80 text-sm font-medium mb-3">
                  <HiOutlineLocationMarker className="mr-2 text-accent text-xl" />
                  {property.location}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight max-w-2xl">
                  {property.title}
                </h1>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-4xl text-center">
                <p className="text-white/60 text-xs tracking-widest uppercase mb-1 font-semibold">
                  Asking Price
                </p>
                <p className="text-accent text-3xl md:text-4xl font-bold">
                  {property.price}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Gallery (only if auxiliary images exist) */}
        {property.images && property.images.length > 0 && (
          <PropertyGallery images={property.images} title={property.title} />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Overview & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Overview */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[30px] p-8 md:p-10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-accent inline-block"></span>
                OVERVIEW
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="border-l-2 border-accent/30 pl-4 py-1">
                  <p className="text-white/50 text-xs tracking-wider uppercase mb-1">
                    Type
                  </p>
                  <p className="text-white font-medium text-lg">
                    {property.property_type}
                  </p>
                  <p className="text-accent text-sm mt-1">{property.beds}</p>
                </div>
                <div className="border-l-2 border-white/10 pl-4 py-1">
                  <p className="text-white/50 text-xs tracking-wider uppercase mb-1">
                    Status
                  </p>
                  <p className="text-white font-medium text-lg">
                    {property.status}
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Size: {property.size}
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-5 h-[250px] lg:h-auto rounded-[30px] overflow-hidden relative border border-white/10 group cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
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
                className="absolute inset-0 z-0"
              ></iframe>
              <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-white uppercase tracking-wider font-semibold">
                Location Map
              </div>
            </div>
          </div>

          {/* Video Tour (YouTube Embed) */}
          {property.video_placeholder &&
            (() => {
              // Extract YouTube video ID from various URL formats
              const getYouTubeEmbedUrl = (url) => {
                if (!url) return null;
                let videoId = null;
                // youtube.com/watch?v=
                const watchMatch = url.match(
                  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                );
                if (watchMatch) videoId = watchMatch[1];
                // youtu.be/
                if (!videoId) {
                  const shortMatch = url.match(
                    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                  );
                  if (shortMatch) videoId = shortMatch[1];
                }
                // youtube.com/embed/
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
                <div className="relative w-full aspect-video rounded-[30px] overflow-hidden mb-16 shadow-2xl border border-white/10">
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
              );
            })()}

          {/* Description & Features vs Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Left Column: Description & Features */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-accent inline-block"></span>
                  ABOUT THE PROPERTY
                </h3>
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  {property.description}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="bg-white/5 border border-white/10 p-8 rounded-[30px]">
                  <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">
                    Key Features & Amenities
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {property.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-white/80 text-sm"
                      >
                        <HiOutlineCheck className="text-accent text-lg shrink-0 mr-3 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
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

          {/* ─── Related Properties Section (Internal Linking) ──────────── */}
          {relatedProperties && relatedProperties.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-accent inline-block"></span>
                SIMILAR PROPERTIES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProperties.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/properties/${related.slug}`}
                    className="group block bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all hover:bg-white/10"
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
            </section>
          )}
        </div>
      </main>
    </>
  );
}
