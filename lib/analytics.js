/**
 * Google Analytics & Search Console Integration
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Analytics 4 property at https://analytics.google.com
 * 2. Copy your Measurement ID (starts with "G-")
 * 3. Add it to your .env.local: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * 4. Go to Google Search Console: https://search.google.com/search-console
 * 5. Add your property (domain or URL prefix)
 * 6. Use the "HTML tag" verification method
 * 7. Copy the verification code
 * 8. Add it to your .env.local: NEXT_PUBLIC_GSC_VERIFICATION=your-code-here
 *
 * Both tags will be automatically injected into every page via the root layout.
 */

import Script from "next/script";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

/**
 * Returns the Search Console verification meta tag content.
 * Used in root layout metadata.
 */
export function getSearchConsoleVerification() {
  return "GJOoUmi7cDKWqGS544RqriONCI7DRm2aA7dDc9naePc" ;
}
