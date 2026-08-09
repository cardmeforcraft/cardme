/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable gzip/brotli compression for all responses
  compress: true,
  images: {
    // Use explicit domains instead of wildcard for better security
    // and to enable Next.js image optimization properly.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      // Keep a broad fallback for any other external images in the DB
      { protocol: "https", hostname: "**" },
    ],
    // Generate WebP/AVIF variants automatically
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 week
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
