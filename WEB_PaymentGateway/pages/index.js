import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const CATS = ["All", "Drinks", "Snacks", "Bundle"];

export default function SelectItem() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { add, count } = useCart();

  useEffect(() => {
    fetch(`/api/products?category=${cat}`).then((r) => r.json()).then(setProducts);
  }, [cat]);

  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <button
          aria-label="Menu"
          className="flex items-center justify-center w-9 h-9 rounded-md bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <b>Logo</b>
      </div>
      <Link href="/checkout" aria-label="Keranjang" className="relative p-1 text-gray-800">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.1L20.5 7H6" />
          <circle cx="9.5" cy="19.5" r="1.4" />
          <circle cx="17" cy="19.5" r="1.4" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gray-600 text-white text-[10px] leading-none">
            {count}
          </span>
        )}
      </Link>
    </header>

    <div className="px-4 pb-4 border-b">
      <div className="relative">
        <input
          className="w-full border rounded p-2 pr-10"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </div>
    </div>
      <div className="flex gap-4 px-4 border-b overflow-x-auto">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`pb-2 ${cat === c ? "border-b-2 border-black font-semibold" : ""}`}>{c}</button>
        ))}
      </div>
      {list.map((p) => (
        <div key={p._id} className="p-4 border-b">
          <div className="flex gap-4">
            <div className="w-36 h-36 shrink-0 bg-gray-200 rounded overflow-hidden">
              {p.image && (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div>Rp{p.price.toLocaleString("id-ID")}</div>
              <div className="text-xs text-gray-400">{p.description}</div>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button onClick={() => add(p)} className="border rounded px-3 py-1">
              Add +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}