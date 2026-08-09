import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Otp from "@/models/Otp";
import crypto from "crypto";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, OTP, and New Password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Verify OTP exists for the email and is active
    const activeOtp = await Otp.findOne({ email });
    if (!activeOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (activeOtp.expiresAt.getTime() < Date.now()) {
      await Otp.deleteOne({ _id: activeOtp._id });
      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the input OTP to verify against the stored hash
    const inputHash = crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
    if (activeOtp.otpHash !== inputHash) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP code. Please check and try again." },
        { status: 400 }
      );
    }

    // Find the Admin associated with this email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found associated with this email" },
        { status: 404 }
      );
    }

    // Hash new password and update
    admin.passwordHash = hashPassword(newPassword);
    await admin.save();

    // Consume the OTP so it cannot be used again
    await Otp.deleteOne({ _id: activeOtp._id });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Reset Password API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
