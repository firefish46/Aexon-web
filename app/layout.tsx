import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { themeScript } from "@/components/ThemeToggle";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Aexon Healthcare | Dry laser film imagers made in the UK",
    template: "%s | Aexon Healthcare",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Aexon Healthcare | Dry laser film imagers made in the UK",
    description: site.description,
    url: site.url,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Aexon Laser Prime and Laser Pro imagers" }],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aexon Healthcare | Dry laser film imagers made in the UK",
    description: site.description,
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#181818",
  colorScheme: "dark light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/aexon-logo.png`,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    postalCode: site.address.postcode,
    addressCountry: "GB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The head scripts change the class and theme before hydration
    <html
      lang="en-GB"
      className={`${GeistSans.variable} ${GeistMono.variable} no-js`}
      suppressHydrationWarning
    >
      <head>
        {/* Mark JS as available before paint so scroll reveals start hidden */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
        {/* Apply a saved theme before paint so it never flashes */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link button-sm">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
