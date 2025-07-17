import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const db = await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const month = searchParams.get("month"); // format: YYYY-MM
  let query = {};
  if (search) {
    query = {
      $or: [
        { "user.name": { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { _id: ObjectId.isValid(search) ? new ObjectId(search) : undefined },
      ],
    };
  }
  if (month) {
    const [year, m] = month.split("-");
    const start = new Date(Number(year), Number(m) - 1, 1);
    const end = new Date(Number(year), Number(m), 1);
    query.date = { $gte: start, $lt: end };
  }
  // Remove undefined _id if search is not a valid ObjectId
  if (query.$or) query.$or = query.$or.filter(Boolean);
  const orders = await db.collection("orders").find(query).sort({ date: -1 }).toArray();
  return NextResponse.json(orders);
}

export async function PATCH(req) {
  const db = await connectToDatabase();
  const { _id, status, paymentMethod } = await req.json();
  if (!_id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  const update = {};
  if (status) update.status = status;
  if (paymentMethod) update.paymentMethod = paymentMethod;
  if (!Object.keys(update).length) return NextResponse.json({ error: "No update fields" }, { status: 400 });
  await db.collection("orders").updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const db = await connectToDatabase();
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  await db.collection("orders").deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
} 