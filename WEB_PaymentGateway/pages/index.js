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
      <header className="flex items-center justify-between p-4 border-b">
        <b>Logo</b>
        <Link href="/checkout">🛒 <span className="bg-red-500 text-white text-xs rounded-full px-2">{count}</span></Link>
      </header>
      <div className="p-4">
        <input className="w-full border rounded p-2" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex gap-4 px-4 border-b overflow-x-auto">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`pb-2 ${cat === c ? "border-b-2 border-black font-semibold" : ""}`}>{c}</button>
        ))}
      </div>
      {list.map((p) => (
        <div key={p._id} className="flex gap-3 p-4 border-b">
          <div className="w-20 h-20 bg-gray-200 rounded" />
          <div className="flex-1">
            <div className="font-medium">{p.name}</div>
            <div>Rp{p.price.toLocaleString("id-ID")}</div>
            <div className="text-xs text-gray-400">{p.description}</div>
            <button onClick={() => add(p)} className="mt-2 border rounded px-3 py-1 float-right">Add +</button>
          </div>
        </div>
      ))}
    </div>
  );
}