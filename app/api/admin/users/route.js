import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const db = await connectToDatabase();
  const users = await db.collection("users").find({}).toArray();
  return NextResponse.json(users);
}

export async function PUT(req) {
  const { _id, name, email, admin } = await req.json();
  if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("users").updateOne(
    { _id: new ObjectId(_id) },
    { $set: { name, email, admin } }
  );
  return NextResponse.json({ _id, name, email, admin });
}

export async function DELETE(req) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const db = await connectToDatabase();
  await db.collection("users").deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ _id });
} 