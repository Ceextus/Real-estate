import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * A lightweight Supabase client for build-time operations like
 * generateStaticParams and sitemap generation.
 * Does NOT use cookies — safe to call outside request scope.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
