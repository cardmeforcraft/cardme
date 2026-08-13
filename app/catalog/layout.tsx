import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog | Explore Premium Diecast Cars",
  description: "Browse our entire collection of premium diecast models, from 1:64 scale hot wheels to 1:18 heavy alloy cars.",
  openGraph: {
    title: "Catalog | Explore Premium Diecast Cars - DIECAST ELITE",
    description: "Browse our entire collection of premium diecast models.",
    url: "https://www.cardmeforcraft.in/catalog",
    type: "website",
  },
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "DIECAST ELITE Catalog",
    "description": "Premium diecast model cars catalog",
    "url": "https://www.cardmeforcraft.in/catalog",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
