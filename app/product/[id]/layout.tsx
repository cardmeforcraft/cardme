import { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectToDatabase();
    const product = await Product.findOne({
      $or: [{ slug: params.id }, { _id: params.id.length === 24 ? params.id : null }]
    }).lean();

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    const title = `${product.name} | DIECAST ELITE`;
    const description = product.description || `Buy ${product.name} at DIECAST ELITE. Scale: ${product.scale}.`;
    const imageUrl = product.images?.[0] || "/og-image.jpg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.cardmeforcraft.in/product/${params.id}`,
        images: [{ url: imageUrl }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "DIECAST ELITE",
    };
  }
}

export default async function ProductLayout({ params, children }: Props) {
  let productJsonLd = null;

  try {
    await connectToDatabase();
    const product = await Product.findOne({
      $or: [{ slug: params.id }, { _id: params.id.length === 24 ? params.id : null }]
    }).lean();

    if (product) {
      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [],
        "description": product.description || `${product.name} diecast model.`,
        "sku": product._id.toString(),
        "brand": {
          "@type": "Brand",
          "name": product.brand || "DIECAST ELITE"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://www.cardmeforcraft.in/product/${params.id}`,
          "priceCurrency": "INR",
          "price": product.price,
          "availability": product.inStock && (product.stockCount ?? 1) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };
    }
  } catch (error) {
    console.error("Failed to generate Product JSON-LD", error);
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
