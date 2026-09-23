import { Inter, Italiana } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics, getSearchConsoleVerification } from "@/lib/analytics";

// Body / UI text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display headlines (free stand-in for Milky — swap here to change the headline face)
const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.andreamshomes.com";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Andreams Homes | Real Estate Developers in Abuja & Lagos, Nigeria",
    template: "%s | Andreams Homes",
  },

  description:
    "Andreams Global Properties Ltd (AGPL) — Abuja's premier real estate developer. Explore affordable homes, serviced plots, and property investments across Abuja FCT, Karu, Kurudu, Lugbe, Jikwoyi, and Lagos.",

  keywords: [
    "real estate developer Abuja",
    "properties for sale Abuja",
    "homes for sale Nigeria",
    "Andreams Homes",
    "Andreams Global Properties",
    "AGPL",
    "buy property Abuja",
    "affordable homes Abuja",
    "serviced plots Abuja",
    "real estate investment Nigeria",
    "property for sale Karu Kurudu Lugbe",
    "land for sale Abuja FCT",
    "property developer Lagos Nigeria",
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
    title: "Andreams Homes | Real Estate Developers in Abuja & Lagos, Nigeria",
    description:
      "Andreams Global Properties Ltd — Abuja's premier real estate developer. Affordable homes, serviced plots, and property investments across Abuja FCT and Lagos.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Andreams Homes — Real Estate Developers in Abuja & Lagos",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Andreams Homes | Real Estate Developers in Abuja & Lagos, Nigeria",
    description:
      "Explore affordable homes, serviced plots, and property investments across Abuja FCT and Lagos, Nigeria.",
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
        name: "Andreams Global Properties Ltd",
        alternateName: "Andreams Homes",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
        description:
          "Abuja-based real estate developer offering affordable homes, serviced plots, and property investments across Abuja FCT and Lagos, Nigeria. RC: 11464337.",
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
        className={`${inter.variable} ${italiana.variable} font-sans antialiased min-h-screen bg-canvas`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}  