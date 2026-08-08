"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Car } from "lucide-react";

function GarageCatalogContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    scale: searchParams.get("scale") || "",
    series: searchParams.get("series") || "",
    color: searchParams.get("color") || "",
    maxPrice: 150,
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const scaleParam = searchParams.get("scale");
    const seriesParam = searchParams.get("series");
    const searchParam = searchParams.get("search");
    if (scaleParam) setFilters((prev) => ({ ...prev, scale: scaleParam }));
    if (seriesParam) setFilters((prev) => ({ ...prev, series: seriesParam }));
    if (searchParam !== null) setSearchQuery(searchParam);
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filters.scale) params.set("scale", filters.scale);
      if (filters.series) params.set("series", filters.series);
      if (filters.color) params.set("color", filters.color);
      if (filters.maxPrice < 150) params.set("maxPrice", filters.maxPrice.toString());
      if (sortBy) params.set("sort", sortBy);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters, searchQuery, sortBy]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ scale: "", series: "", color: "", maxPrice: 150 });
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-800 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-[#0256B3]" />
          <span>Filters {filters.scale || filters.series || filters.color ? "(Active)" : ""}</span>
        </button>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none">
            <option value="featured">Nearest to Scale</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className={`lg:block ${mobileFilterOpen ? "block" : "hidden"}`}>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase text-slate-500 mr-1">Active:</span>
              {filters.scale && <span className="bg-[#0256B3] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">{filters.scale}<button onClick={() => handleFilterChange({ scale: "" })} className="hover:text-amber-300 ml-1">×</button></span>}
              {filters.series && <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">Series: {filters.series}<button onClick={() => handleFilterChange({ series: "" })} className="hover:text-amber-300 ml-1">×</button></span>}
              {filters.color && <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">Color: {filters.color}<button onClick={() => handleFilterChange({ color: "" })} className="hover:text-amber-300 ml-1">×</button></span>}
              {searchQuery && <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">Search: &quot;{searchQuery}&quot;<button onClick={() => setSearchQuery("")} className="hover:text-amber-300 ml-1">×</button></span>}
              {!filters.scale && !filters.series && !filters.color && !searchQuery && <span className="text-xs text-slate-400 font-medium">All Models</span>}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0256B3]">
                <option value="featured">Nearest to Scale</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-[#0256B3] animate-spin mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Diecast Collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold uppercase text-slate-800">No diecast models match your filters</h3>
              <button onClick={handleClearFilters} className="mt-4 bg-[#0256B3] text-white text-xs font-extrabold px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-colors uppercase tracking-wider">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id || product.slug} id={product._id || product.slug} name={product.name} slug={product.slug} brand={product.brand} scale={product.scale} series={product.series} price={product.price} originalPrice={product.originalPrice} images={product.images} color={product.color} badge={product.badge} />
              ))}
            </div>
          )}

          <div className="pt-6 flex items-center justify-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => setCurrentPage(n)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === n ? "bg-[#0256B3] text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-100"}`}>{n}</button>
            ))}
            <span className="text-xs text-slate-400 font-bold px-1">...</span>
            <button onClick={() => setCurrentPage(10)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === 10 ? "bg-[#0256B3] text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-100"}`}>10</button>
            <button onClick={() => setCurrentPage((p) => p + 1)} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200"><RefreshCw className="w-8 h-8 text-[#0256B3] animate-spin mb-2" /><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Garage Catalog...</p></div>}>
      <GarageCatalogContent />
    </Suspense>
  );
}
