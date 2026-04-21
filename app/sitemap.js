import { createStaticClient } from "@/utils/supabase/static";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.andreamshomes.com";

export default async function sitemap() {
  const supabase = createStaticClient();

  // ─── Static Pages ────────────────────────────────────────────────────────
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // ─── Dynamic Property Pages ──────────────────────────────────────────────
  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at, created_at")
    .order("created_at", { ascending: false });

  const propertyPages = (properties || []).map((p) => ({
    url: `${siteUrl}/properties/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ─── Dynamic Blog Pages ──────────────────────────────────────────────────
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const blogPages = (posts || []).map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...blogPages];
}
