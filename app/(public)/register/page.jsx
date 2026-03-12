"use client";

import Link from "next/link";
import { GoHomeFill } from "react-icons/go";

export default function RegisterPage() {
  return (
    <div className="w-full flex min-h-[calc(100vh-80px)] bg-primary selection:bg-accent selection:text-white font-sans items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
          <GoHomeFill className="text-white text-3xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          Registration Closed
        </h2>
        
        <p className="text-white/70 mb-8 leading-relaxed">
          Public registration is currently disabled for Andream Homes. Only administrators can create new accounts. If you are a team member, please contact your administrator for access.
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
