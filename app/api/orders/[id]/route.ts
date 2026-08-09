import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // If changing to Success and it wasn't Success before, decrement stock
    if (body.status === "Success" && order.status !== "Success") {
      // Decrement stock for each item
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockCount: -item.quantity } }
        );
      }
    } 
    // Optional: If you wanted to restore stock when changing from Success to something else
    // else if (order.status === "Success" && body.status !== "Success") {
    //   for (const item of order.items) {
    //     await Product.findByIdAndUpdate(
    //       item.productId,
    //       { $inc: { stockCount: item.quantity } }
    //     );
    //   }
    // }

    order.status = body.status;
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order update error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to update order" }, { status: 500 });
  }
}
