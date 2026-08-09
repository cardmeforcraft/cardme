import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_jwt_auth_protection_cardme_2026";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyToken(token, JWT_SECRET);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        username: payload.username,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("Auth status API error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
