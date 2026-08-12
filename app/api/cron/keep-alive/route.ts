import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Connect to database (pre-warms the cache and logs verification)
    await connectToDatabase();
    
    // Perform a lightweight database query to keep connection active
    const count = await Product.countDocuments();
    
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: "active",
      database: "connected",
      productsCount: count,
      durationMs: duration,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error: any) {
    console.error("Keep-alive request failed:", error);
    return NextResponse.json({
      success: false,
      status: "error",
      database: "disconnected",
      error: error.message || "Failed to keep alive"
    }, {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    });
  }
}
