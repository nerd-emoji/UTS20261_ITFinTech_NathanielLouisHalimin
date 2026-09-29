import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow">
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}