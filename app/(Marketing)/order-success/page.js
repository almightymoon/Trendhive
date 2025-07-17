"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function OrderSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const router = useRouter();

  useEffect(() => {
    if (!session_id) {
      setError("No session_id found in URL.");
      setLoading(false);
      return;
    }
    fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error || "Order confirmation failed.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Server error. Please try again later.");
        setLoading(false);
      });
  }, [session_id]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 bg-gray-50">
        {loading ? (
          <div className="text-lg font-semibold">Processing your order...</div>
        ) : error ? (
          <div className="text-red-600 text-xl font-bold">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you for your purchase!</h1>
            <p className="mb-2">Your order has been placed successfully.</p>
            <div className="my-4 text-left">
              <h2 className="text-lg font-semibold mb-2">Invoice</h2>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Order #</span>
                  <span className="font-mono">{order._id?.toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Date</span>
                  <span>{order.date ? new Date(order.date).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Customer</span>
                  <span>{order.user?.name || '-'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Address</span>
                  <span>{order.user?.address || '-'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Payment</span>
                  <span>{order.paymentMethod || '-'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Status</span>
                  <span>{order.status || '-'}</span>
                </div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-2 text-left">Product</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="py-2 px-2">{item.title || item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity || 1}</td>
                      <td className="py-2 px-2 text-right">${(item.price * (item.quantity || 1)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-2 px-2 font-bold text-right" colSpan={2}>Total</td>
                    <td className="py-2 px-2 font-bold text-right">${order.price?.toLocaleString() || order.amount?.toLocaleString() || '-'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="text-green-700 font-semibold mb-2">A copy of this invoice has been sent to your email.</div>
            <button
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => router.push("/")}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 