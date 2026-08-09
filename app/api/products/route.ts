import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/lib/seedData";

// Track whether we've seeded in this server process — avoids a countDocuments
// round-trip on every single request.
let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(INITIAL_PRODUCTS);
  }
  seeded = true;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const scale = searchParams.get("scale");
    const series = searchParams.get("series");
    const color = searchParams.get("color");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") || "24", 10)));

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (scale) query.scale = { $regex: scale, $options: "i" };
    if (series) query.series = { $regex: series, $options: "i" };
    if (color) query.color = { $regex: color, $options: "i" };
    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };

    let sortOptions: any = { createdAt: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "scale") sortOptions = { scale: 1 };
    else if (sort === "name") sortOptions = { name: 1 };

    const skip = (page - 1) * limit;

    // Run count and data fetch in parallel for speed
    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean().exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      { success: true, products, total, page, totalPages, limit, source: "mongodb" },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=120" } }
    );
  } catch (error: any) {
    console.error("MongoDB products query error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Database connection error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, message: "Name and Price are required fields" },
        { status: 400 }
      );
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct = new Product({
      name: body.name,
      slug,
      brand: body.brand || "Diecast Elite",
      scale: body.scale || "1:64 (Standard)",
      series: body.series || "Street / Track",
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80"],
      color: body.color || "Silver",
      badge: body.badge || "NEW ARRIVAL",
      description: body.description || `${body.name} diecast model vehicle.`,
      features: Array.isArray(body.features) ? body.features : ["Authentic Diecast Metal", "Detailed Interior"],
      inStock: true,
      stockCount: body.stockCount ? parseInt(body.stockCount) : 20,
    });

    // Reset the seeded flag so new product is visible on next fetch
    seeded = false;

    await newProduct.save();
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("MongoDB product creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Database insertion error" },
      { status: 500 }
    );
  }
}
