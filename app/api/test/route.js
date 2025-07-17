import { connectToDatabase } from "@/app/utils/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();
    console.log("connected to database");

    const users = await db.collection("users").find({}).limit(10).toArray();

    return Response.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
