import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const db = await connectToDatabase();
  const categories = await db.collection("categories").find({}).toArray();
  return NextResponse.json(categories);
}

export async function POST(req) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const db = await connectToDatabase();
  const result = await db.collection("categories").insertOne({ name });
  return NextResponse.json({ _id: result.insertedId, name});
}

export async function PUT(req) {
  const { _id, name, description } = await req.json();
  if (!_id || !name) return NextResponse.json({ error: "ID and name required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("categories").updateOne({ _id: new ObjectId(_id) }, { $set: { name, description } });
  return NextResponse.json({ _id, name, description });
}

export async function DELETE(req) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("categories").deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
} 