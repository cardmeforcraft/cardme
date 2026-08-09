import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  scale: string;
  color: string;
  quantity: number;
}

export interface ICart extends Document {
  sessionId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  scale: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

if (mongoose.models.Cart) delete mongoose.models.Cart;

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
