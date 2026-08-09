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
  title: "DIECAST ELITE | Premium Diecast Toy Cars & Collectibles",
  description: "Shop high-quality diecast model cars in 1:64, 1:42, 1:32, and 1:18 scale. Features Nissan Skyline GTR, Dodge Charger R/T, Ford Bronco, Hot Wheels, MiniGT and iconic imports.",
  keywords: "diecast cars, toy car shop, model cars, 1:64 scale, Nissan Skyline GT-R, Kinsmart, MiniGT, Hot Wheels",
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
