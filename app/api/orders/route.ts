import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({}).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("MongoDB orders query error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database connection error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.customerName || !body.email || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields" },
        { status: 400 }
      );
    }

    const orderNumber = `DIECAST-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      orderNumber,
      customerName: body.customerName,
      email: body.email,
      phone: body.phone || "N/A",
      address: body.address,
      city: body.city,
      zipCode: body.zipCode,
      items: body.items,
      totalAmount: body.totalAmount,
      status: "Pending",
    });

    await newOrder.save();
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("API POST Order error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to save order to database" }, { status: 500 });
  }
}
