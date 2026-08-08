import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectToDatabase();
    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }
    if (product) {
      return NextResponse.json({ success: true, product });
    }
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  } catch (error: any) {
    console.error("MongoDB single product query error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database connection error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    await connectToDatabase();
    let updated = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Product.findByIdAndUpdate(id, body, { new: true });
    } else {
      updated = await Product.findOneAndUpdate({ slug: id }, body, { new: true });
    }
    if (updated) {
      return NextResponse.json({ success: true, product: updated });
    }
    return NextResponse.json({ success: false, message: "Product not found to update" }, { status: 404 });
  } catch (error: any) {
    console.error("MongoDB update product error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database update error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectToDatabase();
    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Product.findByIdAndDelete(id);
    } else {
      deleted = await Product.findOneAndDelete({ slug: id });
    }
    if (deleted) {
      return NextResponse.json({ success: true, message: "Product removed successfully" });
    }
    return NextResponse.json({ success: false, message: "Product not found to delete" }, { status: 404 });
  } catch (error: any) {
    console.error("MongoDB delete product error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database deletion error" }, { status: 500 });
  }
}
