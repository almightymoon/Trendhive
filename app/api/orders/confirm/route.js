import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/app/utils/mongodb";

export async function POST(req) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Fetch the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }
    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json({ error: "No userId in session metadata" }, { status: 400 });
    }
    // Fetch the user's cart from DB
    const db = await connectToDatabase();
    const userCart = await db.collection("carts").findOne({ userId });
    const items = userCart?.items || [];
    // Fetch user info
    const user = await db.collection("users").findOne({ _id: userId.length === 24 ? new (await import('mongodb')).ObjectId(userId) : userId });
    // Flatten product info for admin display
    const productNames = items.map(item => item.title || item.name).join(", ");
    const totalPrice = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    // Save the order
    const order = {
      paymentIntentId: session.payment_intent,
      paymentMethod: "Stripe",
      status: "Paid",
      email: session.customer_email,
      amount: session.amount_total / 100,
      currency: session.currency,
      userId,
      items,
      user: {
        name: user?.name || "",
        address: user?.address || "",
      },
      productName: productNames,
      price: totalPrice,
      date: new Date(),
      createdAt: new Date(),
    };
    await db.collection("orders").insertOne(order);
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order confirmation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 