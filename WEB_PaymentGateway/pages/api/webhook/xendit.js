import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Checkout, Payment } from "@/models";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (req.headers["x-callback-token"] !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { external_id, status, payment_method } = req.body || {};

  // Data tes dari Xendit: balas 200 tanpa menyentuh database
  if (!external_id || !mongoose.isValidObjectId(external_id)) {
    return res.status(200).json({ received: true, note: "ignored" });
  }

  await connectDB();

  if (status === "PAID" || status === "SETTLED") {
    await Checkout.findByIdAndUpdate(external_id, { status: "LUNAS" });
    await Payment.findOneAndUpdate(
      { checkoutId: external_id },
      { status: "PAID", method: payment_method, paidAt: new Date() }
    );
  } else if (status === "EXPIRED") {
    await Checkout.findByIdAndUpdate(external_id, { status: "EXPIRED" });
    await Payment.findOneAndUpdate({ checkoutId: external_id }, { status: "EXPIRED" });
  }

  res.status(200).json({ received: true });
}   