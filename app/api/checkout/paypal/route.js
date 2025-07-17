import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";

export async function POST(req) {
  try {
    const { cart } = await req.json();
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    // You will use the PayPal REST API here. For now, just return a dummy orderId for frontend integration.
    // In production, use @paypal/checkout-server-sdk and your credentials.

    // Save order to DB (simulate success)
    const db = await connectToDatabase();
    await db.collection('orders').insertOne({
      paymentMethod: 'PayPal',
      status: 'Paid',
      products: cart,
      amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      currency: 'usd',
      email: 'paypal-user@example.com', // Replace with real user info if available
      createdAt: new Date(),
    });

    return NextResponse.json({ orderId: "DUMMY_PAYPAL_ORDER_ID" });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json({ error: "PayPal error" }, { status: 500 });
  }
} 