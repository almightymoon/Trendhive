import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/app/utils/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cart, userId } = await req.json();
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const line_items = cart.map(item => {
      // Fallbacks for Stripe requirements
      const name = item.title || item.name || "Product";
      const image = item.image || item.mainImage;
      const product_data = { name };
      if (image) product_data.images = [image];
      return {
      price_data: {
        currency: "usd",
          product_data,
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
      };
    });
    // Ensure base URL is absolute and has a scheme
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_BASE_URL
      : process.env.NEXT_PUBLIC_BASE_URL;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        userId: userId || "",
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
} 