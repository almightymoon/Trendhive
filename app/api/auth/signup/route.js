import { connectToDatabase} from "@/app/utils/mongodb"
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password, admin } = await req.json();
    
    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    // Only allow admin==1 if the request is from an authenticated admin (for security)
    let isAdmin = 0;
    if (admin === 1) {
      // Check for admin token in headers
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const jwt = require("jsonwebtoken");
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const adminUser = await db.collection("users").findOne({ _id: decoded.userId && typeof decoded.userId === 'string' && decoded.userId.length === 24 ? new (await import('mongodb')).ObjectId(decoded.userId) : decoded.userId });
          if (adminUser && adminUser.admin === 1) {
            isAdmin = 1;
          }
        } catch (e) {}
      }
    }
    const newUser = { name, email, password: hashedPassword, admin: isAdmin, createdAt: new Date() };

    const result = await db.collection("users").insertOne(newUser);
    
    // Generate token for the new user
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ userId: result.insertedId, email: newUser.email, admin: newUser.admin }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return user data without password
    const userData = {
      id: result.insertedId,
      email: newUser.email,
      name: newUser.name,
      admin: newUser.admin,
      phone: '',
      address: '',
      city: '',
      country: '',
      state: '',
      avatar: '',
      createdAt: newUser.createdAt
    };

    return Response.json({ message: "User registered successfully", token, user: userData }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
