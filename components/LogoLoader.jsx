"use client";

import Image from "next/image";

export default function LogoLoader({ fullscreen = false, message = "" }) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="animate-logo-pulse">
          <Image
            src="/logo.png"
            alt="Andreams Homes"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
        {message && (
          <p className="mt-6 text-sm text-white/50 font-medium tracking-wide animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-200 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="animate-logo-pulse">
        <Image
          src="/logo.png"
          alt="Andreams Homes"
          width={460}
          height={460}
          className="object-contain"
          priority
        />
      </div>
      {message && (
        <p className="mt-4 text-sm text-white/50 font-medium tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
