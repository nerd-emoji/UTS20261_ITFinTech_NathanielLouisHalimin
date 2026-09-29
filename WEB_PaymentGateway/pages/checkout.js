import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { cart, add } = useCart();
  const items = Object.values(cart);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const rp = (n) => "Rp" + n.toLocaleString("id-ID");

  return (
    <div>
      <header className="p-4 border-b flex gap-4"><Link href="/">‹ Back</Link><b>Checkout</b></header>
      {items.map(({ product, qty }) => (
        <div key={product._id} className="flex gap-3 p-4 border-b items-center">
          <div className="w-14 h-14 bg-gray-200 rounded" />
          <div className="flex-1">
            <div>{product.name}</div>
            <div className="flex items-center gap-2 border rounded w-fit mt-1">
              <button className="px-2" onClick={() => add(product, -1)}>−</button>
              <span>{qty}</span>
              <button className="px-2" onClick={() => add(product, 1)}>+</button>
            </div>
          </div>
          <div>{rp(product.price * qty)}</div>
        </div>
      ))}
      <div className="p-4 space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>{rp(subtotal)}</span></div>
        <div className="flex justify-between"><span>Tax (11%)</span><span>{rp(tax)}</span></div>
        <div className="flex justify-between font-bold"><span>Total</span><span>{rp(subtotal + tax)}</span></div>
        <Link href="/payment" className={`block text-center mt-4 p-3 rounded border ${items.length ? "" : "pointer-events-none opacity-40"}`}>
          Continue to Payment →
        </Link>
      </div>
    </div>
  );
}