import { connectToDatabase } from "@/app/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const url = req?.url || "";
    const { searchParams } = new URL(url, "http://localhost");
    
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = parseInt(searchParams.get("skip")) || 0;

    let query = {};

    // Filter by ID
    if (id) {
      try {
        query._id = new ObjectId(id);
      } catch (e) {
        return Response.json({ error: "Invalid product ID" }, { status: 400 });
      }
    }

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } }
      ];
    }

    const products = await db.collection("products")
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
} 