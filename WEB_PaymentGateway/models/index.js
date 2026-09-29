import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  category: String, // Drinks, Snacks, Bundle
  image: String,
});

const CheckoutSchema = new Schema({
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  subtotal: Number,
  tax: Number,
  total: Number,
  shippingAddress: String,
  status: { type: String, default: "PENDING" }, // PENDING | LUNAS | EXPIRED
  createdAt: { type: Date, default: Date.now },
});

const PaymentSchema = new Schema({
  checkoutId: { type: Schema.Types.ObjectId, ref: "Checkout" },
  xenditInvoiceId: String,
  invoiceUrl: String,
  amount: Number,
  method: String,
  status: { type: String, default: "PENDING" },
  paidAt: Date,
});

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Checkout = mongoose.models.Checkout || mongoose.model("Checkout", CheckoutSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);