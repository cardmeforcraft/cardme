import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema<IOtp>({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index: expires at the exact date specified
}, { timestamps: true });

if (mongoose.models.Otp) delete mongoose.models.Otp;

const Otp: Model<IOtp> = mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
