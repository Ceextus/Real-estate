import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { HiArrowLeft } from "react-icons/hi";
import { BsCalendarEvent, BsPersonFill } from "react-icons/bs";
import PropertyGallery from "@/components/PropertyGallery";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // YouTube embed helper (reused from property detail)
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) videoId = watchMatch[1];
    if (!videoId) {
      const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (shortMatch) videoId = shortMatch[1];
    }
    if (!videoId) {
      const embedMatch = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
      if (embedMatch) videoId = embedMatch[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(post.youtube_url);

  return (
    <main className="min-h-screen bg-primary pt-24 pb-24 overflow-hidden selection:bg-accent selection:text-white">

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center text-white/70 hover:text-accent transition-colors gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors">
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-sm font-medium tracking-wide">Back to Blog</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <div className="w-full h-[40vh] md:h-[55vh] rounded-[30px] md:rounded-[50px] overflow-hidden relative shadow-2xl group">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                <BsCalendarEvent />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full font-medium">
                <BsPersonFill className="text-accent" />
                {post.author || "Andream Homes"}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Gallery (if additional images exist) */}
      {post.images && post.images.length > 0 && (
        <PropertyGallery images={post.images} title={post.title} />
      )}

      {/* YouTube Video Embed */}
      {embedUrl && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
          <div className="relative w-full aspect-video rounded-[30px] overflow-hidden shadow-2xl border border-white/10">
            <iframe
              src={embedUrl}
              title={`${post.title} - Video`}
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 md:p-12 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-accent inline-block"></span>
            Article
          </h2>
          <div className="text-white/80 text-lg leading-relaxed font-medium whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </section>

    </main>
  );
}
