import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Schema, Model } from "mongoose";

// ── Default values ──────────────────────────────────────────────────────────
const DEFAULT_SCALES = [
  "1:64 (Standard)",
  "1:42 (Premium)",
  "1:32 (Standard)",
  "1:24 (Premium)",
  "1:18 (Collector)",
];

const DEFAULT_CATEGORIES = [
  "Fast & Furious",
  "80s - 90s - 00s",
  "Street / Track",
  "Baja Racers",
  "Imports",
  "Muscle",
];

const DEFAULT_WHATSAPP = "917907343387"; // 91 = India country code

// ── Mongoose schema (singleton document) ────────────────────────────────────
interface IConfig {
  _id: string;
  scales: string[];
  categories: string[];
  whatsappNumber: string;
}

const ConfigSchema = new Schema<IConfig>({
  _id: { type: String, default: "app_config" },
  scales: { type: [String], default: DEFAULT_SCALES },
  categories: { type: [String], default: DEFAULT_CATEGORIES },
  whatsappNumber: { type: String, default: DEFAULT_WHATSAPP },
});

// Always delete cached model so schema changes are picked up in dev
if (mongoose.models.Config) delete mongoose.models.Config;
const Config: Model<IConfig> = mongoose.model<IConfig>("Config", ConfigSchema);

// ── GET /api/config ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectToDatabase();
    let doc = await Config.findById("app_config");
    if (!doc) {
      doc = await Config.create({
        _id: "app_config",
        scales: DEFAULT_SCALES,
        categories: DEFAULT_CATEGORIES,
        whatsappNumber: DEFAULT_WHATSAPP,
      });
    }
    // Ensure existing docs that pre-date the field still get a default
    const whatsappNumber = doc.whatsappNumber || DEFAULT_WHATSAPP;

    return NextResponse.json(
      { success: true, scales: doc.scales, categories: doc.categories, whatsappNumber, source: "mongodb" },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=120" } }
    );
  } catch (e: any) {
    console.error("Config GET error:", e);
    return NextResponse.json({ success: false, message: e.message || "Database connection error" }, { status: 500 });
  }
}

// ── POST /api/config ─────────────────────────────────────────────────────────
// Body: { scales?: string[], categories?: string[], whatsappNumber?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scales: string[] | undefined = body.scales;
    const categories: string[] | undefined = body.categories;
    const whatsappNumber: string | undefined = body.whatsappNumber;

    if (!scales && !categories && !whatsappNumber) {
      return NextResponse.json({ success: false, message: "Provide scales, categories, or whatsappNumber" }, { status: 400 });
    }

    // Validate WhatsApp number: must be exactly 10 digits (Indian mobile)
    if (whatsappNumber !== undefined) {
      const digits = whatsappNumber.replace(/\D/g, "");
      if (digits.length !== 10) {
        return NextResponse.json(
          { success: false, message: "WhatsApp number must be exactly 10 digits (without country code)" },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();
    const update: any = {};
    if (scales) update.scales = scales;
    if (categories) update.categories = categories;
    if (whatsappNumber !== undefined) {
      const digits = whatsappNumber.replace(/\D/g, "");
      update.whatsappNumber = `91${digits}`; // store with country code
    }

    const doc = await Config.findByIdAndUpdate(
      "app_config",
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({
      success: true,
      scales: doc!.scales,
      categories: doc!.categories,
      whatsappNumber: doc!.whatsappNumber,
    });
  } catch (error: any) {
    console.error("Config POST error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database update error" }, { status: 500 });
  }
}
