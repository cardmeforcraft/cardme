"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Star, Zap, Trophy, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getOptimizedImageUrl } from "@/lib/image";

const FEATURED_DIVISIONS = [
  {
    title: "METAL CARS , RC CARS",
    subtitle: "Choose your discipline. Build your fleet.",
    image: "/images/division-Diecast cars.png",
    href: "/catalog?series=Metal+cars&series=rc+cars",
    overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
  },
  {
    title: "DIE CAST CARS FRAME",
    subtitle: "Precision Engineering",
    image: "/images/image copy.png",
    href: "/catalog?series=Die+Cast+Cars+Frame",
    overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
  },
  {
    title: "Soft dolls , pinterest items",
    subtitle: "So many items",
    image: "/images/softdolls.png",
    href: "/catalog?series=Soft+dolls&series=Pinterest+items",
    overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
  },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/products?sort=featured");
        const data = await res.json();
        if (data.success) {
          setFeaturedProducts((data.products || []).slice(0, 4));
        }
      } catch (e) {
        console.error("Failed to load featured products", e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleQuickAdd = (product: any) => {
    const maxStock = product.stockCount ?? 0;
    const isOutOfStock = maxStock <= 0 || product.inStock === false;

    if (isOutOfStock) {
      alert("This item is currently out of stock.");
      return;
    }

    addToCart({
      id: product._id || product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      scale: product.scale,
      color: product.color,
      maxStock: maxStock,
    });
  };

  return (
    <div>
      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Full-width banner with Red Track Lamborghini
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-slate-900" style={{ minHeight: "540px" }}>
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.png"
            alt="Red Lamborghini Track Supercar"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
        </div>

        {/* Hero Text Content matching reference design screenshot */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ minHeight: "540px" }}>
          <div className="max-w-xl py-16 sm:py-24">
           

            {/* Main Heading */}
            <h1 className="text-white leading-[0.95]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight italic uppercase">
                DRIVE YOUR
              </span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight italic text-[#C8102E] uppercase mt-1">
                PASSION
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-white/90 text-xs sm:text-sm mt-5 leading-relaxed max-w-md font-medium">
              Discover the ultimate collection of precision-engineered diecast models. From classic muscle to modern supercars, elevate your gallery today.
            </p>

            {/* CTA Pill Button matching reference design */}
            <div className="mt-8">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-[#0256B3] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95 uppercase tracking-wider"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED DIVISIONS SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-1 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic" }}>
                Featured Divisions
              </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium ml-11">
              Choose your discipline. Build your fleet.
            </p>
          </div>

          {/* Division Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_DIVISIONS.map((division, idx) => (
              <Link
                key={idx}
                href={division.href}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <Image
                  src={division.image}
                  alt={division.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${division.overlay}`} />
                {/* Text content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="text-white text-xl sm:text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic" }}>
                    {division.title}
                  </h3>
                  <p className="text-white/70 text-xs font-semibold mt-0.5 uppercase tracking-wider">
                    {division.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-white/60 group-hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PRODUCTS SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-1 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic" }}>
                Featured Products
              </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium ml-11">
              Precision-engineered legends for your collection.
            </p>
          </div>

          {/* Product Cards */}
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-[#C8102E] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => {
                const img = product.images?.[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80";
                return (
                  <div key={product._id || product.slug} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                    {/* Image */}
                    <Link href={`/product/${product.slug}`} className="block relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      {product.badge && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider ${
                            product.badge.includes("SALE") || product.badge.includes("DISCOUNT")
                              ? "bg-[#C8102E] text-white"
                              : product.badge.includes("NEW")
                              ? "bg-[#1A1A2E] text-white"
                              : "bg-emerald-600 text-white"
                          }`}>
                            {product.badge}
                          </span>
                        </div>
                      )}
                      <Image
                        src={getOptimizedImageUrl(img, 400)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-xs sm:text-sm text-[#1A1A2E] group-hover:text-[#C8102E] transition-colors line-clamp-2 uppercase tracking-tight">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal normal-case">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-x-1.5 flex-1 min-w-0">
                          <span className="text-base sm:text-lg font-black text-[#1A1A2E]">₹{product.price?.toFixed(2)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={(product.stockCount ?? 0) <= 0 || product.inStock === false}
                          className={`flex-shrink-0 p-2 rounded-lg shadow-sm transition-all ${(product.stockCount ?? 0) <= 0 || product.inStock === false ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-[#0256B3] hover:bg-blue-700 active:scale-95 text-white'}`}
                          title={(product.stockCount ?? 0) <= 0 || product.inStock === false ? "Out of Stock" : "Add to Cart"}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[#1A1A2E] hover:bg-slate-800 text-white font-bold text-xs px-8 py-3.5 rounded-lg shadow transition-all uppercase tracking-wider"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST / BRAND BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="bg-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#C8102E]/10 flex items-center justify-center text-[#C8102E]">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A2E] uppercase">Premium Quality</h4>
              <p className="text-xs text-slate-500"></p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#C8102E]/10 flex items-center justify-center text-[#C8102E]">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A2E] uppercase">Fast Shipping</h4>
              <p className="text-xs text-slate-500"></p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#C8102E]/10 flex items-center justify-center text-[#C8102E]">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A2E] uppercase">Collector Approved</h4>
              <p className="text-xs text-slate-500"></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
