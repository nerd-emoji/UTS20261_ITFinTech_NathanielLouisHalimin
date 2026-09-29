import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Status() {
  const { query } = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!query.id) return;
    const load = () => fetch(`/api/checkout/${query.id}`).then((r) => r.json()).then(setOrder);
    load();
    const t = setInterval(load, 3000); // polling sampai webhook mengubah status
    return () => clearInterval(t);
  }, [query.id]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Status Pembayaran</h1>
      <div className={`text-3xl font-bold ${order?.status === "LUNAS" ? "text-green-600" : "text-orange-500"}`}>
        {order?.status || "Memuat..."}
      </div>
      <p className="mt-2 text-sm text-gray-500">Total: Rp{order?.total?.toLocaleString("id-ID")}</p>
      <Link href="/" className="inline-block mt-6 underline">Belanja lagi</Link>
    </div>
  );
}