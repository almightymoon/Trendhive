import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/app/utils/mongodb";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers.get("stripe-signature");
  const buf = await req.arrayBuffer();
  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("Stripe webhook received:", event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Session metadata:", session.metadata);
    // Save order to DB
    try {
      const db = await connectToDatabase();
      let items = [];
      if (session.metadata?.userId) {
        const userCart = await db.collection("carts").findOne({ userId: session.metadata.userId });
        if (userCart && userCart.items) {
          items = userCart.items;
        }
      }
      await db.collection("orders").insertOne({
        paymentIntentId: session.payment_intent,
        paymentMethod: "Stripe",
        status: "Paid",
        email: session.customer_email,
        amount: session.amount_total / 100,
        currency: session.currency,
        userId: session.metadata?.userId,
        items,
        createdAt: new Date(),
      });
      console.log("Order saved to DB for userId:", session.metadata?.userId);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  }
  return NextResponse.json({ received: true });
} 