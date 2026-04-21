import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics, getSearchConsoleVerification } from "@/lib/analytics";

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.andreamshomes.com";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Andreams Homes | Luxury Real Estate in Lagos, Nigeria",
    template: "%s | Andreams Homes",
  },

  description:
    "Andreams Homes is Lagos's premier luxury real estate developer. Explore exclusive properties for sale, land investments, and bespoke smart homes in Lekki, Ikoyi, Banana Island, and beyond.",

  keywords: [
    "luxury real estate Nigeria",
    "properties for sale Abuja",
    "homes for sale Nigeria",
    "Andreams Homes",
    "real estate developer Nigeria",
    "buy property Abuja",
    "luxury homes Lagos",
    "smart homes Nigeria",
    "real estate investment Nigeria",
    "luxury apartments Abuja Lagos",
    "property for sale Lekki",
    "Ikoyi Banana Island property",
  ],

  authors: [{ name: "Andreams Homes", url: siteUrl }],
  creator: "Andreams Homes",
  publisher: "Andreams Homes",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Andreams Homes",
    title: "Andreams Homes | Luxury Real Estate in Lagos, Nigeria",
    description:
      "Andreams Homes is Lagos's premier luxury real estate developer. Explore exclusive properties for sale, land investments, and bespoke smart homes.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Andreams Homes — Luxury Real Estate in Lagos",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Andreams Homes | Luxury Real Estate in Lagos, Nigeria",
    description:
      "Explore exclusive properties for sale, land investments, and bespoke smart homes in Lagos, Nigeria.",
    images: ["/og-default.jpg"],
    creator: "@Andreamshomes",
  },

  alternates: {
    canonical: siteUrl,
    languages: {
      "en-NG": siteUrl,
    },
  },

  verification: {
    google: getSearchConsoleVerification(),
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Andreams Homes",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
        description:
          "Lagos's premier luxury real estate developer. Exclusive properties for sale, land investments, and bespoke smart homes.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          areaServed: "NG",
          availableLanguage: "English",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Andreams Homes",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/properties?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url: `${siteUrl}/blog`,
    name: "Andreams Homes Blog",
    description:
      "Real estate news, market insights, and property investment tips from Andreams Homes.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
      </head>
      <body
        className={`${clashDisplay.className} ${clashDisplay.variable} antialiased min-h-screen bg-surface`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}  