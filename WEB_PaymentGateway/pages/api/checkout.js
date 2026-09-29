import { connectDB } from "@/lib/mongodb";
import { Product, Checkout, Payment } from "@/models";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();

  const { items, shippingAddress } = req.body; // items: [{id, qty}]

  // Hitung ulang harga dari DB (jangan percaya harga dari client)
  const products = await Product.find({ _id: { $in: items.map((i) => i.id) } });
  const lines = items.map((i) => {
    const p = products.find((x) => String(x._id) === i.id);
    return { productId: i.id, name: p.name, price: p.price, qty: i.qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  const checkout = await Checkout.create({ items: lines, subtotal, tax, total, shippingAddress });

  const auth = Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64");
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const xr = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      external_id: String(checkout._id),
      amount: total,
      description: `Order ${checkout._id}`,
      currency: "IDR",
      success_redirect_url: `${base}/status?id=${checkout._id}`,
      failure_redirect_url: `${base}/status?id=${checkout._id}`,
    }),
  });
  const inv = await xr.json();
  if (!xr.ok) return res.status(500).json(inv);

  await Payment.create({
    checkoutId: checkout._id,
    xenditInvoiceId: inv.id,
    invoiceUrl: inv.invoice_url,
    amount: total,
  });

  res.json({ checkoutId: checkout._id, invoiceUrl: inv.invoice_url });
}