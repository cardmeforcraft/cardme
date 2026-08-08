"use client";

import React, { useState, useEffect } from "react";
import { Filter, RotateCcw, Check } from "lucide-react";

export interface FilterState {
  scale: string;
  series: string;
  color: string;
  maxPrice: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const COLORS = [
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#22C55E" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Black", hex: "#18181B" },
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Silver", hex: "#94A3B8" },
];

// Static fallbacks if the API is unavailable
const DEFAULT_SCALES = [
  "1:64 (Standard)",
  "1:42 (Premium)",
  "1:18 (Collector)",
  "1:32 (Standard)",
];
const DEFAULT_SERIES = [
  "80s - 90s - 00s",
  "Fast & Furious",
  "Street / Track",
  "Baja Racers",
  "Imports",
  "Muscle",
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [scales, setScales] = useState<string[]>(DEFAULT_SCALES);
  const [series, setSeries] = useState<string[]>(DEFAULT_SERIES);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (data.scales?.length) setScales(data.scales);
          if (data.categories?.length) setSeries(data.categories);
        }
      })
      .catch(() => { /* use defaults */ });
  }, []);

  return (
    <aside className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="inhabit-logo text-xl font-black text-slate-900 tracking-tight uppercase">
            THE GARAGE
          </h2>
          <Filter className="w-4 h-4 text-slate-400" />
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Explore all cars</p>
      </div>

      <hr className="border-slate-100" />

      {/* Scale Section */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">Scale</h3>
        <div className="space-y-2">
          {scales.map((s) => {
            const isChecked = filters.scale === s;
            return (
              <label
                key={s}
                onClick={() => onFilterChange({ scale: isChecked ? "" : s })}
                className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-[#0256B3] select-none"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-[#0256B3] border-[#0256B3] text-white"
                      : "border-slate-300 bg-slate-50"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{s}</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Series Pills Section */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">Series</h3>
        <div className="flex flex-wrap gap-1.5">
          {series.map((s) => {
            const isActive = filters.series === s;
            return (
              <button
                key={s}
                onClick={() => onFilterChange({ series: isActive ? "" : s })}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  isActive
                    ? "bg-[#0256B3] text-white border-[#0256B3] shadow-sm"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Price Slider Section */}
      <div>
        <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
          <span>Price</span>
          <span className="text-[#0256B3] font-extrabold text-xs">Up to ${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min={0}
          max={150}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
          <span>$0</span>
          <span>$150+</span>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Color Picker Swatches */}
      <div>
        <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-3">Color</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {COLORS.map((c) => {
            const isActive = filters.color.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                title={c.name}
                onClick={() => onFilterChange({ color: isActive ? "" : c.name })}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                  isActive ? "scale-125 ring-2 ring-offset-2 ring-[#0256B3]" : "hover:scale-110"
                } ${(c as any).border ? "border border-slate-300" : ""}`}
                style={{ backgroundColor: c.hex }}
              >
                {isActive && (
                  <Check
                    className={`w-3 h-3 ${
                      c.name === "White" || c.name === "Yellow" ? "text-slate-900" : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-lg border border-slate-200 flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>CLEAR FILTERS</span>
      </button>
    </aside>
  );
}
