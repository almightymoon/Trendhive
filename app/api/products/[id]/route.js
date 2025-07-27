import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const db = await connectToDatabase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    let product;
    try {
      product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    } catch (e) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
} 