import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token and check expiration
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Replace "users" with your collection name

    // Fetch user data from the database
    const user = await usersCollection.findOne({ email: decoded.email }); // Assuming email is stored in the token
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding sensitive fields like password)
    const userData = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
