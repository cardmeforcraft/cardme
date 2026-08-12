import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "diecast_elite";

    // Set parameters to sign
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
    };

    // Generate the cryptographic signature using API secret
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUD_SECRET || ""
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUD_KEY,
      cloudName: process.env.CLOUD_NAME,
    });
  } catch (error: any) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
