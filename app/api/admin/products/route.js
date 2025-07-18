import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const db = await connectToDatabase();
  const url = req?.url || "";
  const isFeatured = url.includes("featured=true");
  let products;
  if (isFeatured) {
    products = await db.collection("products").find({ featured: true }).limit(3).toArray();
  } else {
    products = await db.collection("products").find({}).toArray();
  }
  return NextResponse.json(products);
}

export async function POST(req) {
  const { productId, name, price, shortDescription, description, category, mainImage, images, brand } = await req.json();
  if (!name || !price || !category || !mainImage) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const db = await connectToDatabase();
  const result = await db.collection("products").insertOne({ productId, name, price, shortDescription, description, category, mainImage, images, brand, createdAt: new Date() });
  return NextResponse.json({ _id: result.insertedId });
}

export async function PATCH(req) {
  const { _id, ...update } = await req.json();
  if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = await connectToDatabase();
  // Enforce max 3 featured products
  if (update.featured === true) {
    const featuredCount = await db.collection("products").countDocuments({ featured: true });
    if (featuredCount >= 3) {
      return NextResponse.json({ error: "You can only feature up to 3 products." }, { status: 400 });
    }
  }
  await db.collection("products").updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("products").deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
} 