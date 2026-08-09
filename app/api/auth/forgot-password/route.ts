import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Otp from "@/models/Otp";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { hashPassword } from "@/lib/auth";

async function sendOTPEmail(email: string, otp: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "";

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"Cardme Security" <${user}>`,
        to: email,
        subject: "Your Admin Password Reset OTP - Cardme",
        text: `Your 6-digit password reset OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #C8102E; text-align: center;">Cardme Admin Security</h2>
            <p>You requested a password reset for your admin account. Use the following One-Time Password (OTP) to proceed:</p>
            <div style="background: #f7f9fa; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #1A1A2E;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #666; text-align: center;">This OTP is valid for 10 minutes. If you did not request this, please secure your credentials immediately.</p>
          </div>
        `,
      });
      console.log(`Real OTP email sent to ${email}`);
    } catch (err: any) {
      console.error("Nodemailer failed to send email. Logging OTP fallback:", err.message);
      logOtpFallback(email, otp);
    }
  } else {
    logOtpFallback(email, otp);
  }
}

function logOtpFallback(email: string, otp: string) {
  console.log("\n========================================");
  console.log(`[SMTP CONFIG NOT FOUND / FALLBACK] OTP GENERATED`);
  console.log(`To: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log("========================================\n");
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Sync or seed admin record in DB with the environment variable recovery email
    const expectedRecoveryEmail = process.env.RECOVERY_EMAIL || "cardmeforcraft@gmail.com";
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = hashPassword("cardmeforcraft123");
      await Admin.create({
        username: "cardme@999",
        email: expectedRecoveryEmail,
        passwordHash,
      });
      console.log("Admin seeded from forgot-password route.");
    } else {
      await Admin.updateOne(
        { username: "cardme@999" },
        { $set: { email: expectedRecoveryEmail } }
      );
    }

    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username or Email is required" },
        { status: 400 }
      );
    }

    // Locate the admin
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Username/Email does not match any admin records" },
        { status: 404 }
      );
    }

    // Security Rule: OTP will ALWAYS be sent to the user's registered recovery email
    const recoveryEmail = process.env.RECOVERY_EMAIL || admin.email || "cardmeforcraft@gmail.com";

    // Rate Limiting: check if an OTP was recently sent (within 60 seconds) to prevent spam
    const existingOtp = await Otp.findOne({ email: recoveryEmail });
    if (existingOtp) {
      const createdAt = (existingOtp as any).createdAt;
      if (createdAt && Date.now() - new Date(createdAt).getTime() < 60 * 1000) {
        const secondsLeft = Math.ceil(60 - (Date.now() - new Date(createdAt).getTime()) / 1000);
        return NextResponse.json(
          { success: false, message: `Please wait ${secondsLeft} seconds before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Securely hash OTP before saving to DB
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Remove any existing active OTPs for this email to prevent spam/replay
    await Otp.deleteMany({ email: recoveryEmail });

    // Store new OTP with 10 minutes expiry
    await Otp.create({
      email: recoveryEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    // Send email (async)
    await sendOTPEmail(recoveryEmail, otp);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully. Please check ${recoveryEmail.slice(0, 3)}***@gmail.com.`,
      email: recoveryEmail, // returned to show user where it was sent
    });
  } catch (error: any) {
    console.error("Forgot Password API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to request password reset OTP" },
      { status: 500 }
    );
  }
}
