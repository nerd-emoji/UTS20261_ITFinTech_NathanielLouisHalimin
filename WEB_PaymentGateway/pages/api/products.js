import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models";

export default async function handler(req, res) {
  await connectDB();
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      { name: "Es Teh", price: 8000, description: "Teh manis dingin", category: "Drinks" },
      { name: "Kopi Susu", price: 18000, description: "Kopi susu gula aren", category: "Drinks" },
      { name: "Keripik Singkong", price: 12000, description: "Renyah & gurih", category: "Snacks" },
      { name: "Coklat Bar", price: 15000, description: "Dark chocolate", category: "Snacks" },
      { name: "Paket Hemat", price: 30000, description: "Kopi + snack", category: "Bundle" },
    ]);
  }
  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  res.json(await Product.find(filter));
}