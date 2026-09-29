import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const METHODS = [
  { id: "CARD", label: "Credit/Debit Card" },
  { id: "BANK", label: "Bank Transfer (Virtual Account)" },
  { id: "EWALLET", label: "E-Wallet (OVO, DANA, ShopeePay, LinkAja)" },
  { id: "QRIS", label: "QRIS" },
];

const rp = (n) => "Rp" + n.toLocaleString("id-ID");

export default function Payment() {
  const { cart, clear } = useCart();
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("CARD");
  const [loading, setLoading] = useState(false);

  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  async function pay() {
    setLoading(true);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product._id, qty: i.qty })),
          shippingAddress: address,
          paymentMethod: method,
        }),
      });
      const data = await r.json();
      if (data.invoiceUrl) {
        clear();
        window.location.href = data.invoiceUrl;
      } else {
        alert("Gagal membuat invoice");
        setLoading(false);
      }
    } catch (e) {
      alert("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="p-4 border-b flex gap-4">
        <Link href="/checkout">‹ Back</Link>
        <b>Secure Checkout</b>
      </header>

      <div className="p-4 space-y-5">
        <div>
          <div className="font-semibold mb-1">Shipping Address</div>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Alamat lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <div className="font-semibold mb-2">Payment Method</div>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 border rounded p-3 cursor-pointer ${
                  method === m.id ? "border-black bg-gray-50" : ""
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                />
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="font-semibold mb-1">Order Summary</div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Item(s)</span><span>{rp(subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax (11%)</span><span>{rp(tax)}</span></div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total</span><span>{rp(total)}</span>
            </div>
          </div>
        </div>

        <button
          disabled={loading || !address.trim() || !items.length}
          onClick={pay}
          className="w-full bg-gray-700 text-white p-3 rounded disabled:opacity-40"
        >
          {loading ? "Memproses..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}