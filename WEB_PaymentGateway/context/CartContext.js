import { createContext, useContext, useEffect, useState } from "react";
const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}); // { productId: {product, qty} }

  useEffect(() => {
    const s = localStorage.getItem("cart");
    if (s) setCart(JSON.parse(s));
  }, []);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const add = (p, d = 1) =>
    setCart((c) => {
      const qty = (c[p._id]?.qty || 0) + d;
      const n = { ...c };
      if (qty <= 0) delete n[p._id];
      else n[p._id] = { product: p, qty };
      return n;
    });
  const clear = () => setCart({});
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  return <CartCtx.Provider value={{ cart, add, clear, count }}>{children}</CartCtx.Provider>;
}