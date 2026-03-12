"use client";

import { useState } from "react";
import Image from "next/image";
import { BsXLg, BsChevronLeft, BsChevronRight, BsGrid3X3Gap } from "react-icons/bs";

export default function PropertyGallery({ images, title }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") closeLightbox();
  };

  // Show max 5 thumbnails; rest hidden behind "+N" badge
  const visibleCount = 5;
  const visibleImages = images.slice(0, visibleCount);
  const remainingCount = images.length - visibleCount;

  return (
    <>
      {/* Compact Thumbnail Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <BsGrid3X3Gap className="text-accent" />
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">
            Gallery
          </h2>
          <span className="text-white/30 text-xs">
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {visibleImages.map((url, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden border border-white/10 cursor-pointer group hover:border-accent/50 transition-colors"
            >
              <Image
                src={url}
                alt={`${title} - View ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="112px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
            </div>
          ))}

          {/* "+N more" tile */}
          {remainingCount > 0 && (
            <div
              onClick={() => openLightbox(visibleCount)}
              className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden border border-white/10 cursor-pointer group hover:border-accent/50 transition-colors"
            >
              <Image
                src={images[visibleCount]}
                alt="More photos"
                fill
                className="object-cover blur-[2px] brightness-50"
                sizes="112px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-bold">+{remainingCount}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          ref={(el) => el?.focus()}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <BsXLg />
          </button>

          <div className="absolute top-6 left-6 z-50 text-white/60 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <BsChevronLeft className="text-xl" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl h-[80vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - View ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <BsChevronRight className="text-xl" />
            </button>
          )}

          {/* Bottom thumbnail strip in lightbox */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
            {images.map((url, idx) => (
              <div
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                  idx === currentIndex ? "border-accent scale-110" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
