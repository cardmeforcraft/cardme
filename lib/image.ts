/**
 * Optimizes image URLs for Cloudinary and Unsplash dynamically.
 * Adds auto-format, auto-quality, and custom widths where applicable.
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return "";

  // 1. Cloudinary optimization
  if (url.includes("res.cloudinary.com")) {
    const uploadIndex = url.indexOf("/image/upload/");
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 14); // includes "/image/upload/"
      const suffix = url.substring(uploadIndex + 14);
      
      // Inject f_auto, q_auto and width parameters
      const params = ["f_auto", "q_auto"];
      if (width) {
        params.push(`w_${width}`);
        params.push("c_limit");
      }
      
      return `${prefix}${params.join(",")}/${suffix}`;
    }
  }

  // 2. Unsplash optimization
  if (url.includes("images.unsplash.com") && width) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", String(width));
      urlObj.searchParams.set("q", "80");
      urlObj.searchParams.set("auto", "format");
      return urlObj.toString();
    } catch (e) {
      console.error("Error formatting Unsplash URL:", e);
      return url;
    }
  }

  return url;
}
