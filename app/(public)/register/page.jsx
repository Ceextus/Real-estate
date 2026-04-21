"use client";

import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="w-full flex min-h-[calc(100vh-80px)] bg-primary selection:bg-accent selection:text-white font-sans items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
        <div className="relative h-16 w-56 mx-auto mb-6">
          <Image
            src="/logo.png"
            alt="Andreams Homes Logo"
            fill
            className="object-contain drop-shadow-md brightness-0" // The brightness-0 turns the logo black if needed since the background is white/light. If the logo is dark originally, remove it. Assuming the theme needs a dark logo here.
            priority
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          Registration Closed
        </h2>

        <p className="text-white/70 mb-8 leading-relaxed">
          Public registration is currently disabled for Andreams Homes. Only
          administrators can create new accounts. If you are a team member,
          please contact your administrator for access.
        </p>

        <Link
          href="/login"
          className="inline-block w-full bg-white text-primary hover:bg-gray-100 py-3.5 rounded-xl font-bold tracking-wider text-[15px] transition-all shadow-lg"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
