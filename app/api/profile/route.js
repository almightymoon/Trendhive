import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token (example using JWT)
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch user data
    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding sensitive fields like password)
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone || "", // Add phone if it exists


    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Parse request body
    const { name, phone } = await req.json();

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Update user data
    const result = await usersCollection.updateOne(
      { email: decoded.email },
      { $set: { name, phone,  } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}