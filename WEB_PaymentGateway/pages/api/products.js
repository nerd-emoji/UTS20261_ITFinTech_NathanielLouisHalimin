import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models";

const SEED = [
  { name: "Es Teh", price: 8000, description: "Teh manis dingin", category: "Drinks", image: "/images/es-teh.jpg" },
  { name: "Kopi Susu", price: 18000, description: "Kopi susu gula aren", category: "Drinks", image: "/images/kopi-susu.jpg" },
  { name: "Keripik Singkong", price: 12000, description: "Renyah & gurih", category: "Snacks", image: "/images/keripik-singkong.jpg" },
  { name: "Coklat Bar", price: 15000, description: "Dark chocolate", category: "Snacks", image: "/images/coklat-bar.jpg" },
  { name: "Paket Hemat", price: 30000, description: "Kopi + snack", category: "Bundle", image: "/images/paket-hemat.jpg" },
];

let seeded = false;

export default async function handler(req, res) {
  await connectDB();

  if (!seeded) {
    await Product.bulkWrite(
      SEED.map((p) => ({
        updateOne: { filter: { name: p.name }, update: { $set: p }, upsert: true },
      }))
    );
    seeded = true;
  }

  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  res.json(await Product.find(filter));
}