import Image from "next/image";
import Link from "next/link";
import { BsCalendarEvent, BsArrowRight } from "react-icons/bs";

export default function BlogCard({ post }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block w-full bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300 border border-white/10"
    >
      {/* Image Container */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Date Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">
          <BsCalendarEvent className="text-accent" />
          {formatDate(post.created_at)}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-white/60 text-sm mb-5 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="w-full h-px bg-white/10 mb-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
              {(post.author || "A")[0].toUpperCase()}
            </div>
            <span className="text-white/50 text-xs font-medium">{post.author || "Andream Homes"}</span>
          </div>
          <div className="flex items-center gap-2 text-accent text-sm font-bold group-hover:gap-3 transition-all">
            Read More
            <BsArrowRight className="text-xs" />
          </div>
        </div>
      </div>
    </Link>
  );
}
