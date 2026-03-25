"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BsEye, BsEyeSlash, BsCheckLg } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="w-full flex-col lg:flex-row flex min-h-[calc(100vh-80px)] bg-primary selection:bg-accent selection:text-white font-sans">
      {/* Left Side - Image & Overlay */}
      <div className="hidden ml-10 lg:flex w-1/2 relative bg-primary items-center justify-center p-8">
        <div className="relative w-full h-[90%] overflow-hidden" style={{ clipPath: 'polygon(0% 15%, 15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
            alt="Modern Architecture"
            fill
            className="object-cover transition-transform duration-1000 hover:scale-105"
            priority
          />
          {/* Gradient Overlay for bottom text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Left Logo Area */}
          <div className="absolute top-10 left-10 z-10 lg:left-16 lg:top-20">
            <Link href="/">
              <div className="relative h-16 w-56 lg:h-20 lg:w-64">
                <Image 
                  src="/logo.png" 
                  alt="Andream Homes Logo" 
                  fill
                  className="object-contain object-left drop-shadow-md brightness-0 invert" // Keeping it white if background is dark, remove classes if original is fine
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Bottom Left Text Area */}
          <div className="absolute bottom-16 left-10 z-10 max-w-md lg:left-16 lg:bottom-24">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Find your sweet home
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Schedule visit in just a few clicks
              <br />
              visits in just a few clicks
            </p>

            {/* Slider Indicators Placeholder */}
            <div className="flex gap-2.5">
              <div className="w-8 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>


      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-8 py-6 lg:px-20 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center max-w-[450px] mx-auto w-full mt-16 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[2rem] font-bold text-white mb-2 tracking-tight">
              Welcome Back to Andream Homes!
            </h2>
            <p className="text-white/60 text-[15px]">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all backdrop-blur-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-mono tracking-widest text-lg backdrop-blur-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <BsEyeSlash size={20} />
                  ) : (
                    <BsEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${formData.rememberMe ? "bg-accent border-accent text-white" : "border-white/30 bg-transparent group-hover:border-white/60"}`}
                >
                  {formData.rememberMe && (
                    <BsCheckLg size={12} strokeWidth={1} />
                  )}
                </div>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-white/80 text-[15px] font-medium scale-95 origin-left">
                  Remember Me
                </span>
              </label>

              <Link
                href="#"
                className="text-white/60 text-[14px] hover:text-white transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-white text-white hover:text-primary py-3.5 rounded-xl font-bold tracking-wider text-[15px] transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider & Social Logins (Temporarily disabled as not functional yet) */}
          {/* 
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-primary text-white/50">
                Instant Login
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm shadow-md"
            >
              <FcGoogle size={20} />
              <span className="text-white/90 text-sm font-medium">
                Continue with Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm shadow-md">
              <div className="w-5 h-5 bg-[#1877f2] rounded-full flex items-center justify-center pb-px">
                <FaFacebookF className="text-white text-xs" />
              </div>
              <span className="text-white/90 text-sm font-medium">
                Continue with Facebook
              </span>
            </button>
          </div>
          */}

          {/* Register Link (Disabled - Admin only creation) 
          <p className="text-center text-white/50 text-sm mt-8 mb-2">
            Don&apos;t have any account?{" "}
            <Link
              href="/register"
              className="text-accent hover:text-white transition-colors font-medium ml-1"
            >
              Register
            </Link>
          </p>
          */}
        </div>
      </div>
    </div>
  );
}
