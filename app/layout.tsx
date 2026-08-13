import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cardmeforcraft.in"),
  title: {
    default: "DIECAST ELITE | Premium Diecast Toy Cars & Collectibles",
    template: "%s | DIECAST ELITE",
  },
  description: "Shop high-quality diecast model cars in 1:64, 1:42, 1:32, and 1:18 scale. Features Nissan Skyline GTR, Dodge Charger R/T, Ford Bronco, Hot Wheels, MiniGT and iconic imports.",
  keywords: "diecast cars, toy car shop, model cars, 1:64 scale, Nissan Skyline GT-R, Kinsmart, MiniGT, Hot Wheels, collectable cars",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.cardmeforcraft.in",
    siteName: "DIECAST ELITE",
    title: "DIECAST ELITE | Premium Diecast Toy Cars & Collectibles",
    description: "Shop high-quality diecast model cars in 1:64, 1:42, 1:32, and 1:18 scale.",
    images: [
      {
        url: "/og-image.jpg", // You can customize this default OG image later
        width: 1200,
        height: 630,
        alt: "DIECAST ELITE - Premium Diecast Models",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIECAST ELITE | Premium Diecast Toy Cars & Collectibles",
    description: "Shop high-quality diecast model cars.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.cardmeforcraft.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.cardmeforcraft.in/#website",
      "url": "https://www.cardmeforcraft.in/",
      "name": "DIECAST ELITE",
      "description": "Premium Diecast Toy Cars & Collectibles",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.cardmeforcraft.in/catalog?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://www.cardmeforcraft.in/#organization",
      "name": "DIECAST ELITE",
      "url": "https://www.cardmeforcraft.in/",
      "logo": "https://www.cardmeforcraft.in/logo.png"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
        <CartProvider>
          <NavbarWrapper />
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
