"use client";
import { useCart } from "@/app/Contexts/CartContext";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useState } from "react";
import Bubbles from "@/components/Bubble/Bubble";
import jwt_decode from "jwt-decode";
import PayPalButton from "@/components/PayPalButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getTotal, incrementQuantity, decrementQuantity } = useCart();
  const [delivery, setDelivery] = useState("free");
  const [loadingStripe, setLoadingStripe] = useState(false);

  async function handleStripeCheckout() {
    setLoadingStripe(true);
    // Get userId from token
    const token = localStorage.getItem("token");
    let userId = "";
    if (token) {
      try {
        const decoded = jwt_decode(token);
        userId = decoded.userId;
      } catch (e) {}
    }
    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, userId })
    });
    const data = await res.json();
    setLoadingStripe(false);
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Stripe checkout failed");
    }
  }

  const handleQuantity = (id, delta) => {
    // This assumes addToCart increases, and removeFromCart removes. You may want to implement setQuantity in CartContext for full control.
    // For now, just a placeholder for UI.
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col pt-32">
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl w-full text-center">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <Link href="/products" className="text-green-600 underline">Go to Products</Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen flex flex-col pt-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Bubbles />
        </div>
        <div className="flex-1 max-w-6xl mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Items Table */}
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <Link href="/products" className="text-gray-500 hover:text-green-600 text-sm">&larr; Go Back</Link>
                <h2 className="text-3xl font-bold text-gray-900">Cart</h2>
                <span className="text-gray-400 text-sm">Home / Cart</span>
              </div>
              <div className="hidden md:grid grid-cols-5 gap-4 border-b pb-2 mb-2 text-gray-500 font-semibold text-sm">
                <span className="col-span-2">Product Details</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 items-center">
                    {/* Product Details */}
                    <div className="flex items-center gap-4 col-span-2">
                      <img src={item.image || item.images?.[0]} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-400">Product Code</p>
                      </div>
                    </div>
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => decrementQuantity(item.id)} className="w-8 h-8 rounded border border-gray-300 text-lg font-bold hover:bg-gray-100">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)} className="w-8 h-8 rounded border border-gray-300 text-lg font-bold hover:bg-gray-100">+</button>
                    </div>
                    {/* Price */}
                    <div className="text-gray-700 font-medium">${item.price.toLocaleString()}</div>
                    {/* Total */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xl ml-2">&times;</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Summary Box */}
            <div className="w-full md:w-80 bg-white rounded-xl shadow p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Total</h3>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Sub-Total</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-700">
                <span>Delivery</span>
                <select value={delivery} onChange={e => setDelivery(e.target.value)} className="border rounded px-2 py-1 text-sm">
                  <option value="free">Standard Delivery (Free)</option>
                  <option value="express">Express Delivery ($10)</option>
                </select>
              </div>
              <button className="w-full py-3 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition mb-4 text-lg">Check Out</button>
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 mt-2 disabled:opacity-60"
                onClick={handleStripeCheckout}
                disabled={loadingStripe}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M20.5 7.5h-17a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1Zm-17-2A3 3 0 0 0 .5 8.5v7a3 3 0 0 0 3 3h17a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-17Z"/><path fill="#fff" d="M7.5 12.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
                {loadingStripe ? "Redirecting..." : "Pay with Stripe"}
              </button>
              <div className="w-full mt-2">
                {/* Map cart items to PayPal format to ensure all required fields are present */}
                {/** Each item must have title, price, quantity, description (optional) **/}
                {/** This matches the logic from the product details page **/}
                {(() => {
                  const paypalProducts = cart.map(item => ({
                    title: item.title || item.name || "Product",
                    price: Number(item.price),
                    quantity: Number(item.quantity) || 1,
                    description: item.description || item.shortDescription || "",
                  }));
                  return (
                    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" }}>
                      <PayPalButton
                        amount={getTotal().toFixed(2)}
                        products={paypalProducts}
                        onSuccess={({ details, orderId }) => {
                          clearCart();
                          const idStr = orderId && orderId.toString ? orderId.toString() : orderId;
                          window.location.href = `/order-success?order_id=${idStr}`;
                        }}
                        onError={err => alert("PayPal error: " + err)}
                      />
                    </PayPalScriptProvider>
                  );
                })()}
              </div>
              <div className="mb-2 text-gray-500 text-sm">We Accept</div>
              <div className="flex gap-3 mb-2">
                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Stripe_Logo%2C_revised_2016.png" alt="Stripe" className="h-6" />
              </div>
              <div className="text-xs text-gray-400 mt-2">Get a discount code? Add it in the next step.</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 