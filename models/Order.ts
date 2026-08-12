import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  scale: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Success" | "Cancelled";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        scale: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Success", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Always delete the cached model in Next.js so schema changes take effect
// without needing a full server restart (avoids stale enum errors in dev).
if (mongoose.models.Order) delete mongoose.models.Order;

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
