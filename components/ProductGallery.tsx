"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

export default function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const defaultImages = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80"
  ];

  // Fill up to 4 images if fewer provided
  while (defaultImages.length < 4) {
    defaultImages.push(defaultImages[0]);
  }

  const [activeImage, setActiveImage] = useState(defaultImages[0]);

  return (
    <div className="space-y-4">
      {/* 2x2 Grid Showcase matching Screenshot 2 */}
      <div className="grid grid-cols-2 gap-3">
        {defaultImages.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
              activeImage === img ? "border-[#0256B3] ring-2 ring-blue-100 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {idx === 0 && badge && (
              <div className="absolute top-2 left-2 z-10">
                <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                  {badge}
                </span>
              </div>
            )}
            <Image
              src={getOptimizedImageUrl(img, 300)}
              alt={`${name} view ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Main Full Preview Box if clicked */}
      <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <Image
          src={getOptimizedImageUrl(activeImage, 800)}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          Click thumbnails above to switch angle
        </div>
      </div>
    </div>
  );
}
