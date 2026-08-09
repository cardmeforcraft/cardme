/* NavbarWrapper.tsx — async server component
   Fetches /api/config once at render time (cached by Next.js fetch),
   builds the full link list, and passes it to the client Navbar.
   This means navbar links appear in the FIRST HTML byte — zero layout shift. */
import Navbar from "./Navbar";

interface NavLinkItem {
  name: string;
  href: string;
}

const FIXED_LINKS: NavLinkItem[] = [
  { name: "HOME", href: "/" },
  { name: "CATALOG", href: "/catalog" },
  { name: "CONTACT", href: "#footer" },
];

async function getNavLinks(): Promise<NavLinkItem[]> {
  try {
    // Use the absolute URL required in server components.
    // NEXT_PUBLIC_SITE_URL should be set in production; fall back to localhost.
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/config`, {
      // Next.js will cache this for 5 minutes (matching our Cache-Control header)
      next: { revalidate: 300 },
    });

    if (!res.ok) return FIXED_LINKS;
    const data = await res.json();
    if (!data.success) return FIXED_LINKS;

    const extra: NavLinkItem[] = [];
    if (Array.isArray(data.scales)) {
      data.scales.forEach((scale: string) => {
        const cleanScale = scale.split(" ")[0] || scale;
        extra.push({ name: cleanScale.toUpperCase(), href: `/catalog?scale=${encodeURIComponent(scale)}` });
      });
    }
    if (Array.isArray(data.categories)) {
      data.categories.forEach((cat: string) => {
        extra.push({ name: cat.toUpperCase(), href: `/catalog?series=${encodeURIComponent(cat)}` });
      });
    }
    return [...FIXED_LINKS, ...extra];
  } catch {
    return FIXED_LINKS;
  }
}

export default async function NavbarWrapper() {
  const initialLinks = await getNavLinks();
  return <Navbar initialLinks={initialLinks} />;
}
