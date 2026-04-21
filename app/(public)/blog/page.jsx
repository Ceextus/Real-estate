import { createClient } from "@/utils/supabase/server";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog — Real Estate News & Insights",
  description:
    "Stay up to date with the latest real estate news, market insights, property investment tips, and project updates from Andreams Global Properties Ltd.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Real Estate News & Insights | Andreams Homes",
    description:
      "Expert insights on Nigerian real estate, property investment strategies, and exclusive project updates from Andreams Homes.",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Real Estate News & Insights | Andreams Homes",
    description:
      "Expert insights on Nigerian real estate, property investment strategies, and exclusive project updates.",
  },
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-primary pt-16 pb-24 selection:bg-accent selection:text-white">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="text-accent text-sm font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-accent"></span>
          Our Blog
          <span className="w-8 h-px bg-accent"></span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          NEWS <span className="text-accent">Updates</span>
        </h1>
        <p className="max-w-2xl mx-auto text-white/70 text-lg">
          Stay informed with the latest insights, project updates, and real
          estate news from Andreams Global Limited.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <span className="text-3xl text-white/30">📰</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Posts Yet</h2>
            <p className="text-white/50 max-w-md mx-auto">
              Check back soon for the latest news and updates from Andreams
              Homes.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
