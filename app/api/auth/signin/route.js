import { connectToDatabase} from "@/app/utils/mongodb"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, admin: user.admin || 0 }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return Response.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    console.error("Signin error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
