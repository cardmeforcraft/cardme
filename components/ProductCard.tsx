"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

import { getOptimizedImageUrl } from "@/lib/image";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  brand: string;
  scale: string;
  series?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  color: string;
  badge?: string;
  priority?: boolean;
  description?: string;
  stockCount?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id, name, slug, brand, scale, series, price, originalPrice, images, color, badge, priority = false, description, stockCount, inStock,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const rawImage = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80";
  const mainImage = getOptimizedImageUrl(rawImage, 400);

  const maxStock = stockCount ?? 0;
  const isOutOfStock = maxStock <= 0 || inStock === false;

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ id: id || slug, name, price, image: mainImage, scale, color, maxStock });
  };

  const getBadgeClass = (badgeText?: string) => {
    if (!badgeText) return "";
    if (badgeText.includes("DISCOUNT") || badgeText.includes("SALE")) return "bg-[#C8102E] text-white";
    if (badgeText.includes("NEW")) return "bg-[#1A1A2E] text-white";
    return "bg-emerald-600 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <Link href={`/product/${slug}`} className="block relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {badge && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm tracking-wider ${getBadgeClass(badge)}`}>{badge}</span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            {scale.split(" ")[0]}
          </span>
        </div>
        <Image src={mainImage} alt={name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" priority={priority} />
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${slug}`} className="block">
            <h3 className="font-extrabold text-sm text-[#1A1A2E] group-hover:text-[#C8102E] transition-colors line-clamp-2 uppercase tracking-tight">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{series || brand}</p>
          {description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-normal normal-case">
              {description}
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-black text-[#1A1A2E] tracking-tight">₹{price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-slate-400 line-through ml-1.5">₹{originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={handleAddCart} 
            disabled={isOutOfStock}
            className={`${isOutOfStock ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#C8102E] hover:bg-[#a00d24] active:scale-95 text-white'} text-xs font-extrabold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all`}
          >
            <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD'}</span>
            {!isOutOfStock && <ShoppingCart className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
