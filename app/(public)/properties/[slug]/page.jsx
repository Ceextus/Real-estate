import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createStaticClient } from "@/utils/supabase/static";
import { HiOutlineLocationMarker, HiOutlineCheck, HiArrowLeft } from "react-icons/hi";
import { BsArrowUpRight, BsTelephone } from "react-icons/bs";
import BookInspectionForm from "@/components/BookInspectionForm";
import PropertyMedia from "@/components/properties/PropertyMedia";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { tidy, sentence, formatPrice, formatBeds, displayPhone, telPhone } from "@/lib/format";

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

// Accepts watch, youtu.be and embed links; returns an embeddable URL or null.
function youTubeEmbed(url) {
  if (!url) return null;
  const id =
    url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1] ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)?.[1] ||
    url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null;
}

const pad = (n) => String(n).padStart(2, "0");
const filled = (rows, key) => (rows || []).filter((r) => r?.[key]);

function PriceTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            {columns.map((c) => (
              <th key={c.key} className={`px-5 py-3.5 font-normal whitespace-nowrap ${c.price ? "text-right" : ""}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0 transition-colors hover:bg-canvas">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-5 py-4 whitespace-nowrap ${
                    c.price ? "text-right font-semibold text-primary whitespace-nowrap" : c.first ? "text-primary" : "text-ink-soft"
                  }`}
                >
                  {(c.price ? formatPrice(row[c.key]) : row[c.key]) || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CheckList({ items, cols = 2 }) {
  return (
    <ul className={`grid grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-px bg-line border border-line`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 bg-white px-5 py-4 text-sm text-primary">
          <HiOutlineCheck className="mt-0.5 shrink-0 text-accent" />
          {item}
        </li>
      ))}
      {/* Blank cell keeps the last row white when the count is odd */}
      {items.length % 2 === 1 && <li aria-hidden className="hidden sm:block bg-white" />}
    </ul>
  );
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

  // Similar listings: same property type first, then the newest others.
  const [{ data: others }, { data: settings }] = await Promise.all([
    supabase
      .from("properties")
      .select("slug, title, image, location, price, type, property_type, status, beds, size, created_at")
      .neq("slug", slug)
      .order("created_at", { ascending: false }),
    supabase.from("site_settings").select("contact").eq("id", 1).single(),
  ]);
  const related = [...(others || [])]
    .sort((a, b) => (b.property_type === property.property_type) - (a.property_type === property.property_type))
    .slice(0, 3);
  const phone = settings?.contact?.phone1;

  // ─── JSON-LD: Product + Offer + RealEstateListing ────────────────────────
  const allImages = [property.image, ...(property.images || [])].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Product", "RealEstateListing"],
    name: property.title,
    description: property.description,
    url: `${siteUrl}/properties/${slug}`,
    image: allImages,
    datePosted: property.created_at,
    brand: { "@type": "Organization", name: "Andreams Homes" },
    offers: {
      "@type": "Offer",
      price: property.price?.replace(/[^0-9.]/g, "") || undefined,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Andreams Homes" },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "NG",
    },
    additionalProperty: [
      property.beds ? { "@type": "PropertyValue", name: "Bedrooms", value: property.beds } : null,
      property.size ? { "@type": "PropertyValue", name: "Size", value: property.size } : null,
      property.status ? { "@type": "PropertyValue", name: "Status", value: property.status } : null,
    ].filter(Boolean),
  };

  const title = tidy(property.title);
  const status = sentence(property.status);
  const facts = [
    property.type && { label: "Type", value: tidy(property.type) },
    property.beds && { label: "Bedrooms", value: formatBeds(property.beds) },
    property.size && { label: "Size", value: tidy(property.size) },
    status && { label: "Status", value: status },
    property.developer && { label: "Developer", value: property.developer },
    property.supported_by && { label: "Supported by", value: property.supported_by },
  ].filter(Boolean);

  const plots = filled(property.plot_types, "type");
  const servicePlots = filled(property.service_plots, "size");
  const banks = filled(property.bank_details, "bank");
  const video = youTubeEmbed(property.video_placeholder);

  // Only sections with content are rendered; numbering follows what's present.
  const sections = [
    property.description && {
      id: "overview",
      title: "Overview",
      body: <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-primary/85 whitespace-pre-line">{property.description}</p>,
    },
    property.features?.length > 0 && {
      id: "features",
      title: "Key features & amenities",
      body: <CheckList items={property.features} />,
    },
    plots.length > 0 && {
      id: "plots",
      title: "Plot types & pricing",
      body: (
        <>
          <PriceTable
            rows={plots}
            columns={[
              { key: "type", label: "Type", first: true },
              { key: "size", label: "Size" },
              { key: "units", label: "Units" },
              { key: "price", label: "Price", price: true },
            ]}
          />
          {property.registration_fee && (
            <p className="mt-3 text-[13px] text-ink-soft">
              Registration fee: <span className="text-primary">{formatPrice(property.registration_fee)}</span>
            </p>
          )}
        </>
      ),
    },
    servicePlots.length > 0 && {
      id: "service-plots",
      title: "Service plots",
      body: (
        <PriceTable
          rows={servicePlots}
          columns={[
            { key: "size", label: "Size", first: true },
            { key: "house_type", label: "House type" },
            { key: "price", label: "Price", price: true },
          ]}
        />
      ),
    },
    property.payment_options?.length > 0 && {
      id: "payment",
      title: "Payment options",
      body: (
        <ol className="border-t border-line">
          {property.payment_options.map((o, i) => (
            <li key={i} className="flex items-baseline gap-4 border-b border-line py-4 text-base text-primary">
              <span className="text-[11px] tabular-nums text-accent">{pad(i + 1)}</span>
              {o}
            </li>
          ))}
        </ol>
      ),
    },
    banks.length > 0 && {
      id: "bank",
      title: "Bank details for payment",
      body: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {banks.map((b, i) => (
            <div key={i} className="border border-line bg-white p-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-accent">{b.bank}</p>
              <p className="mt-2 text-sm text-ink-soft">{b.account_name}</p>
              <p className="mt-1 font-mono text-xl tracking-wider text-primary">{b.account_no}</p>
            </div>
          ))}
        </div>
      ),
    },
    property.facilities?.length > 0 && {
      id: "facilities",
      title: "Standard estate facilities",
      body: <CheckList items={property.facilities} />,
    },
    property.site_plan_image && {
      id: "site-plan",
      title: "Site plan",
      body: (
        <div className="relative aspect-4/3 border border-line bg-white">
          <Image src={property.site_plan_image} alt={`${title} — site plan`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain p-4" />
        </div>
      ),
    },
    video && {
      id: "video",
      title: "Video tour",
      body: (
        <div className="relative aspect-video overflow-hidden bg-primary">
          <iframe
            src={video}
            title={`${title} — Video Tour`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ),
    },
    property.map_embed && {
      id: "location",
      title: "Location",
      body: (
        <div className="group relative h-90 overflow-hidden border border-line bg-surface">
          <iframe
            src={property.map_embed}
            title={`Map — ${title} in ${property.location}`}
            className="absolute inset-0 h-full w-full grayscale-[0.85] transition-[filter] duration-700 group-hover:grayscale-0"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-canvas pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Reveal onMount y={8} className="flex items-center gap-2 text-[13px] text-ink-soft">
            <Link href="/properties" className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary">
              <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              Properties
            </Link>
            <span className="text-line">/</span>
            <span className="truncate text-primary">{title}</span>
          </Reveal>

          {/* Header */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal onMount delay={0.1} className="flex flex-wrap items-center gap-2">
                {property.property_type && (
                  <span className="border border-accent/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-accent">
                    {property.property_type}
                  </span>
                )}
                {status && (
                  <span className="border border-line bg-white px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                    {status}
                  </span>
                )}
              </Reveal>
              <WordReveal
                as="h1"
                onMount
                delay={0.15}
                stagger={0.05}
                lines={[title]}
                className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-primary"
              />
              <Reveal onMount delay={0.4} as="p" className="mt-5 flex items-start gap-1.5 text-sm text-ink-soft">
                <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-base text-accent" />
                {tidy(property.location)}
              </Reveal>
            </div>

            <Reveal onMount delay={0.45} className="lg:col-span-4 lg:justify-self-end lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">Price</p>
              <p className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-primary">
                {formatPrice(property.price)}
              </p>
              <a
                href="#book"
                className="group mt-5 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-white transition-colors duration-300 hover:bg-primary-light"
              >
                Book an inspection
                <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>

          {/* Photos */}
          <div className="mt-10">
            <PropertyMedia images={allImages} title={title} status={status} />
          </div>

          {/* Key facts */}
          {facts.length > 0 && (
            <Reveal className="mt-10 grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-px border border-line bg-line">
              {facts.map((f) => (
                <div key={f.label} className="bg-white px-5 py-5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">{f.label}</p>
                  <p className="mt-2 text-sm font-medium leading-snug text-primary">{f.value}</p>
                </div>
              ))}
            </Reveal>
          )}

          {/* Content + booking */}
          <div className="mt-16 md:mt-24 pb-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-16 md:space-y-20">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <Reveal className="flex items-baseline gap-4 border-b border-line pb-4">
                    <span className="text-[11px] tabular-nums text-accent">{pad(i + 1)}</span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl leading-none tracking-tight text-primary">
                      {s.title}
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1} className="mt-6">
                    {s.body}
                  </Reveal>
                </section>
              ))}
            </div>

            <aside id="book" className="lg:col-span-5 scroll-mt-28">
              <div className="lg:sticky lg:top-28">
                <Reveal className="border border-line bg-white p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent">Book inspection</p>
                  <p className="mt-3 font-display font-bold text-3xl leading-tight text-primary">
                    Schedule a VIP tour of this property
                  </p>
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-y border-line py-4">
                    <span className="min-w-0 truncate text-sm text-ink-soft">{title}</span>
                    <span className="shrink-0 text-base font-semibold text-primary">{formatPrice(property.price)}</span>
                  </div>
                  <div className="mt-8">
                    <BookInspectionForm propertyId={property.id} propertyTitle={property.title} />
                  </div>
                </Reveal>

                {phone && (
                  <Reveal delay={0.1}>
                    <a
                      href={`tel:${telPhone(phone)}`}
                      className="group mt-3 flex items-center justify-between gap-4 border border-line bg-white px-6 py-5 transition-colors hover:border-primary/30"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center bg-canvas text-primary">
                          <BsTelephone className="text-sm" />
                        </span>
                        <span>
                          <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-soft">Prefer to talk?</span>
                          <span className="block text-base text-primary transition-colors group-hover:text-accent">
                            {displayPhone(phone)}
                          </span>
                        </span>
                      </span>
                      <BsArrowUpRight className="text-xs text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Reveal>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Similar properties */}
        {related.length > 0 && (
          <section className="border-t border-line bg-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <WordReveal
                  as="h2"
                  lines={[{ text: "Similar properties", accent: ["properties"] }]}
                  className="font-display font-bold text-4xl sm:text-5xl leading-none tracking-tight text-primary"
                />
                <Reveal>
                  <Link href="/properties" className="group inline-flex items-center gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-primary">
                    View all
                    <BsArrowUpRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Reveal>
              </div>
              <PropertyGrid items={related} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
