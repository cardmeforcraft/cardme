"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, CheckCircle2, ChevronRight, ShieldCheck, Truck, RefreshCw, Plus, Minus } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");

  const productId = params?.id as string;

  useEffect(() => {
    async function getProduct() {
      if (!productId) return;
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedVariant(data.product.color || "Silver and Blue");
        }
      } catch (e) {
        console.error("Failed to load product details", e);
      } finally {
        setLoading(false);
      }
    }
    getProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#C8102E] animate-spin mb-2" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Diecast Vehicle Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="py-16 bg-white rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold uppercase text-slate-900">Vehicle Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This diecast model may no longer be available in our garage.</p>
          <Link
            href="/catalog"
            className="mt-4 inline-block bg-[#C8102E] text-white text-xs font-extrabold px-6 py-2.5 rounded-lg shadow hover:bg-red-700 uppercase"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id || product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        scale: product.scale,
        color: selectedVariant || product.color,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
        <Link href="/" className="hover:text-[#C8102E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/catalog" className="hover:text-[#C8102E]">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-extrabold truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </div>

      {/* Main Detail Grid matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Side Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images || []}
            name={product.name}
            badge={product.badge}
          />
        </div>

        {/* Right Side Vehicle Purchasing Specs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C8102E] bg-red-50 px-2.5 py-1 rounded border border-red-100">
              {product.scale} • {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-3 leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-black text-[#C8102E]">
                ₹{product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Color / Variant Selection Pills */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
              Color Option
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedVariant(product.color || "Silver and Blue")}
                className="bg-[#C8102E] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm"
              >
                {product.color || "Silver and Blue"}
              </button>
            </div>
          </div>

          {/* Quantity Selector & Add To Cart Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border-2 border-slate-200 rounded-full px-3 py-1.5 bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-slate-600 hover:text-slate-900 font-extrabold px-2 py-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-slate-900 px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-slate-600 hover:text-slate-900 font-extrabold px-2 py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add To Cart Outlined Pill Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400 font-black text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-[#C8102E]" />
                <span>Add to cart</span>
              </button>
            </div>

            {/* Buy It Now Prominent Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#C8102E] hover:bg-red-700 text-white font-black text-sm py-3.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-center"
            >
              Buy it now
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Feature Checklist */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">
              Vehicle Specifications
            </h3>
            <ul className="space-y-2.5 text-xs font-bold text-slate-700">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>{product.name} ({product.scale})</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>2 Doors, Hood and Bonnet Openable</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>Metal Diecast Heavyweight Alloy Body</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <span>Light & Sound Engine Simulation</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Shipping & Authenticity guarantees */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C8102E]" />
              <span>Ships within 24 hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
              <span>Official License</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
