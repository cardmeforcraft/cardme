import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/lib/seedData";

export async function GET() {
  try {
    await connectToDatabase();
    await Product.deleteMany({});
    const inserted = await Product.insertMany(INITIAL_PRODUCTS);
    return NextResponse.json({
      success: true,
      message: `Database re-seeded with ${inserted.length} diecast cars!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
