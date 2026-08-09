import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_jwt_auth_protection_cardme_2026";

async function ensureAdminSeeded() {
  const count = await Admin.countDocuments();
  const recoveryEmail = process.env.RECOVERY_EMAIL || "cardmeforcraft@gmail.com";
  if (count === 0) {
    const passwordHash = hashPassword("cardmeforcraft123");
    await Admin.create({
      username: "cardme@999",
      email: recoveryEmail,
      passwordHash,
    });
    console.log("Admin seeded successfully with default credentials.");
  } else {
    // If admin already exists but with a different email, update it to recoveryEmail
    await Admin.updateOne(
      { username: "cardme@999" },
      { $set: { email: recoveryEmail } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureAdminSeeded();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Username/Email and Password are required" },
        { status: 400 }
      );
    }

    // Try to find the admin by username OR email
    const admin = await Admin.findOne({
      $or: [{ username: email }, { email: email }],
    });

    if (!admin) {
      // Secure delay to mitigate brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json(
        { success: false, message: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      // Secure delay to mitigate brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json(
        { success: false, message: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    // Create session token
    const token = await signToken(
      { adminId: admin._id, username: admin.username, email: admin.email },
      JWT_SECRET
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: { username: admin.username, email: admin.email },
    });

    // HTTP-only cookie for secure session tracking
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
