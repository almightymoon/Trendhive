import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "./Contexts/SessionContext";
import { CartProvider } from "./Contexts/CartContext";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider>
            <Toaster />
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
