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

// ── Mongoose schema (singleton document) ────────────────────────────────────
interface IConfig {
  _id: string;
  scales: string[];
  categories: string[];
}

const ConfigSchema = new Schema<IConfig>({
  _id: { type: String, default: "app_config" },
  scales: { type: [String], default: DEFAULT_SCALES },
  categories: { type: [String], default: DEFAULT_CATEGORIES },
});

const Config: Model<IConfig> =
  mongoose.models.Config ||
  mongoose.model<IConfig>("Config", ConfigSchema);

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
      });
    }
    return NextResponse.json({ success: true, scales: doc.scales, categories: doc.categories, source: "mongodb" });
  } catch (e: any) {
    console.error("Config GET error:", e);
    return NextResponse.json({ success: false, message: e.message || "Database connection error" }, { status: 500 });
  }
}

// ── POST /api/config ─────────────────────────────────────────────────────────
// Body: { scales?: string[], categories?: string[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scales: string[] | undefined = body.scales;
    const categories: string[] | undefined = body.categories;

    if (!scales && !categories) {
      return NextResponse.json({ success: false, message: "Provide scales or categories" }, { status: 400 });
    }

    await connectToDatabase();
    const update: any = {};
    if (scales) update.scales = scales;
    if (categories) update.categories = categories;
    const doc = await Config.findByIdAndUpdate(
      "app_config",
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, scales: doc!.scales, categories: doc!.categories });
  } catch (error: any) {
    console.error("Config POST error:", error);
    return NextResponse.json({ success: false, message: error.message || "Database update error" }, { status: 500 });
  }
}
