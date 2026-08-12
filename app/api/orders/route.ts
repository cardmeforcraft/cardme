import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose, { Schema, Model } from "mongoose";

// ── Inline config model (to read whatsappNumber without circular imports) ────
interface IConfig { _id: string; scales: string[]; categories: string[]; whatsappNumber: string; }
const ConfigSchema = new Schema<IConfig>({
  _id: { type: String, default: "app_config" },
  whatsappNumber: { type: String, default: "917907343387" },
}, { strict: false });

if (mongoose.models.Config) delete mongoose.models.Config;
const Config: Model<IConfig> = mongoose.model<IConfig>("Config", ConfigSchema);

const DEFAULT_WHATSAPP = "917907343387";

async function getWhatsAppNumber(): Promise<string> {
  try {
    const doc = await Config.findById("app_config").lean();
    return (doc as any)?.whatsappNumber || DEFAULT_WHATSAPP;
  } catch {
    return DEFAULT_WHATSAPP;
  }
}

function buildWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  items: { name: string; scale: string; color?: string; price: number; quantity: number }[];
  totalAmount: number;
}): string {
  const itemLines = order.items
    .map(
      (item, i) =>
        `  ${i + 1}. ${item.name}\n` +
        `     Scale: ${item.scale}\n` +
        (item.color ? `     Color: ${item.color}\n` : '') +
        `     Qty: ${item.quantity}  ×  ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n\n");

  return (
    `*NEW ORDER RECEIVED — CARDME*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*Order Number:* ${order.orderNumber}\n\n` +
    `*CUSTOMER DETAILS*\n` +
    `*---------------------------------------------*\n` +
    `  Name : ${order.customerName}\n` +
    `  Email: ${order.email || "Not provided"}\n` +
    `  Phone: ${order.phone || "Not provided"}\n\n` +
    `*SHIPPING ADDRESS*\n` +
    `*---------------------------------------------*\n` +
    `  ${order.address}\n` +
    `  ${order.city}${order.zipCode ? " - " + order.zipCode : ""}\n\n` +
    `*ORDER ITEMS (${order.items.length} product${order.items.length > 1 ? "s" : ""})*\n\n` +
    `${itemLines}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*TOTAL AMOUNT: ₹${order.totalAmount.toFixed(2)}*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Placed at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`
  );
}

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("MongoDB orders query error:", error);
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

    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields (Name and Items are required)" },
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

    // ── Read WhatsApp number from DB config ───────────────────────────────────
    const whatsappNumber = await getWhatsAppNumber();
    const message = buildWhatsAppMessage({
      orderNumber,
      customerName: body.customerName,
      email: body.email,
      phone: body.phone || "Not provided",
      address: body.address,
      city: body.city,
      zipCode: body.zipCode,
      items: body.items,
      totalAmount: body.totalAmount,
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json(
      { success: true, order: newOrder, whatsappUrl },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API POST Order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save order to database" },
      { status: 500 }
    );
  }
}
