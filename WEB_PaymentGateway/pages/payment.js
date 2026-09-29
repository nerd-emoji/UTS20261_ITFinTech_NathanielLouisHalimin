import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Payment() {
  const { cart, clear } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + Math.round(subtotal * 0.11);

  async function pay() {
    setLoading(true);
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.product._id, qty: i.qty })),
        shippingAddress: address,
      }),
    });
    const data = await r.json();
    if (data.invoiceUrl) {
      clear();
      window.location.href = data.invoiceUrl; // ke halaman bayar Xendit
    } else {
      setLoading(false);
      alert("Gagal membuat invoice");
    }
  }

  return (
    <div>
      <header className="p-4 border-b flex gap-4"><Link href="/checkout">‹ Back</Link><b>Secure Checkout</b></header>
      <div className="p-4 space-y-4">
        <div>
          <div className="font-semibold mb-1">Shipping Address</div>
          <textarea className="w-full border rounded p-2" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <div className="font-semibold mb-1">Payment Method</div>
          <p className="text-sm text-gray-500">Pilih metode (kartu, e-wallet, VA bank) di halaman Xendit setelah konfirmasi.</p>
        </div>
        <div className="flex justify-between font-bold"><span>Total</span><span>Rp{total.toLocaleString("id-ID")}</span></div>
        <button disabled={loading || !address || !items.length} onClick={pay}
          className="w-full bg-gray-700 text-white p-3 rounded disabled:opacity-40">
          {loading ? "Memproses..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}