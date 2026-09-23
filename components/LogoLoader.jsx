"use client";

import Image from "next/image";

// Loading states in the new style: a softly pulsing logo over a thin gold progress line.
// `fullscreen` fills the viewport on the light canvas (route transitions); the default
// sits inline inside whatever panel is loading, so it never covers the page.
export default function LogoLoader({ fullscreen = false, message = "" }) {
  return (
    <div
      role="status"
      aria-label={message || "Loading"}
      className={
        fullscreen
          ? "fixed inset-0 z-200 flex flex-col items-center justify-center bg-canvas"
          : "flex w-full flex-col items-center justify-center py-16"
      }
    >
      <div className="animate-logo-pulse">
        <Image
          src="/logo.png"
          alt="Andreams Homes"
          width={fullscreen ? 88 : 56}
          height={fullscreen ? 88 : 56}
          className="object-contain"
          priority
        />
      </div>
      <div className="mt-6 h-0.5 w-32 overflow-hidden bg-line">
        <div className="h-full w-1/3 bg-accent animate-loader-bar" />
      </div>
      {message && (
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-ink-soft">{message}</p>
      )}
    </div>
  );
}
