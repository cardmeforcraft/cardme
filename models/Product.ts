import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  scale: string;
  series: string;
  price: number;
  originalPrice?: number;
  images: string[];
  color: string;
  badge?: string;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true, default: "Diecast Elite" },
    scale: { type: String, required: true, default: "1:64 (Standard)" },
    series: { type: String, required: true, default: "Street / Track" },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    images: { type: [String], required: true },
    color: { type: String, required: true, default: "Silver" },
    badge: { type: String },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 25 },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
