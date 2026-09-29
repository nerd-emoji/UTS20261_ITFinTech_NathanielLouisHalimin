import { connectDB } from "@/lib/mongodb";
import { Checkout } from "@/models";

export default async function handler(req, res) {
  await connectDB();
  res.json(await Checkout.findById(req.query.id));
}