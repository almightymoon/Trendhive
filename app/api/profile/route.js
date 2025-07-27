import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";
import bcrypt from "bcrypt";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token (example using JWT)
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 403 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch user data
    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding sensitive fields like password)
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      country: user.country || "",
      avatar: user.avatar || ""
    };

    return Response.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 403 });
    }

    // Parse request body
    const { name, email, phone, address, city, state, country, avatar, dateOfBirth } = await req.json();

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email: decoded.email });
    if (!existingUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update user data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return Response.json({ 
        success: true,
        message: "No changes to update",
        user: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone || '',
          address: existingUser.address || '',
          city: existingUser.city || '',
          state: existingUser.state || '',
          country: existingUser.country || '',
          avatar: existingUser.avatar || '',
          dateOfBirth: existingUser.dateOfBirth || '',
          admin: existingUser.admin || 0,
          createdAt: existingUser.createdAt
        }
      });
    }

    const result = await usersCollection.updateOne(
      { email: decoded.email },
      { $set: updateData }
    );

    // Fetch updated user data
    const updatedUser = await usersCollection.findOne({ email: decoded.email });
    
    // Return updated user data
    const userData = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updatedUser.address || '',
      city: updatedUser.city || '',
      state: updatedUser.state || '',
      country: updatedUser.country || '',
      avatar: updatedUser.avatar || '',
      dateOfBirth: updatedUser.dateOfBirth || '',
      admin: updatedUser.admin || 0,
      createdAt: updatedUser.createdAt
    };

    return Response.json({ 
      success: true,
      message: "Profile updated successfully",
      user: userData 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 403 });
    }

    // Parse request body
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return Response.json({ error: "Old password and new password are required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return Response.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const result = await usersCollection.updateOne(
      { email: decoded.email },
      { $set: { password: hashedNewPassword } }
    );

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Failed to update password" }, { status: 400 });
    }

    return Response.json({ 
      success: true,
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}