import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Automated catalog seeding is disabled. Please add products through the admin panel.",
    },
    { status: 403 }
  );
}
