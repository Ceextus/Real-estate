"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { BsEye, BsEyeSlash, BsCheckLg, BsArrowUpRight } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { Reveal, WordReveal, EASE } from "@/components/motion/Reveal";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const field =
    "mt-2 w-full border-0 border-b border-line bg-transparent pb-3 pt-1 text-base text-primary placeholder:text-ink-soft/50 outline-none transition-colors duration-300 focus:border-accent";
  const label =
    "block text-[11px] uppercase tracking-[0.16em] text-ink-soft transition-colors group-focus-within:text-accent";

  return (
    <div className="bg-canvas">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-16 px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(14px)", scale: 1.02 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          className="relative hidden lg:block overflow-hidden bg-surface"
        >
          <Image
            src="/images/office-exterior.jpg"
            alt="Andreams Global Properties office building"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/10 to-transparent" />
          <div className="absolute left-6 top-6 bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-primary">
            Andreams Homes · Admin portal
          </div>
          <div className="absolute inset-x-0 bottom-0 p-10">
            <WordReveal
              as="p"
              onMount
              delay={0.6}
              lines={["Manage listings,", { text: "messages & inspections.", accent: ["inspections."] }]}
              className="font-display font-bold text-4xl xl:text-5xl leading-[1.05] text-white"
            />
          </div>
        </motion.div>

        {/* Form */}
        <div className="flex flex-col justify-center py-6 lg:py-0">
          <div className="w-full max-w-md lg:mx-auto">
            <Reveal onMount className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Sign in
            </Reveal>
            <WordReveal
              as="h1"
              onMount
              delay={0.15}
              lines={["Welcome back", { text: "to Andreams Homes", accent: ["Homes"] }]}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl leading-[1.02] tracking-tight text-primary"
            />
            <Reveal onMount delay={0.35} as="p" className="mt-4 text-sm text-ink-soft">
              Sign in to your account
            </Reveal>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="mt-8 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Reveal onMount delay={0.45}>
              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <div className="group">
                  <label htmlFor="email" className={label}>
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={field}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="password" className={label}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${field} pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-0 bottom-3 p-1 text-ink-soft transition-colors hover:text-primary"
                    >
                      {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
                    </button>
                  </div>
                </div>

                <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-primary">
                  <span
                    className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                      formData.rememberMe ? "border-primary bg-primary text-white" : "border-line bg-white"
                    }`}
                  >
                    {formData.rememberMe && <BsCheckLg size={11} />}
                  </span>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  Remember me
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex w-full items-center justify-center gap-3 bg-primary px-6 py-4 text-sm text-white transition-colors duration-300 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Login
                      <BsArrowUpRight className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>

            <Reveal onMount delay={0.6} as="p" className="mt-8 text-[13px] text-ink-soft">
              Accounts are created by an administrator. Forgot your password? Ask
              your admin to reset it.
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
