import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await connectToDatabase();
  const cart = await db.collection("carts").findOne({ userId });
  return NextResponse.json(cart || { userId, items: [] });
}

export async function POST(req) {
  const { userId, items } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("carts").updateOne(
    { userId },
    { $set: { items, updatedAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
} 