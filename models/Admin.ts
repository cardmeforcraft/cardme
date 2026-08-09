import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  email: string; // recovery email
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
