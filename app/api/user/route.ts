import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import mongoose from "mongoose";

async function getAuthenticatedUserId(req: Request) {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  const authHeader = req.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7) // remove "Bearer "
    : null;

  if (!accessToken) {
    return { userId: null, error: "No access token provided" };
  }

  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return { userId: payload.userId as string, error: null };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { userId: null, error: "Invalid or expired token" };
  }
}

export async function GET(request: Request) {
  await connectDB();

  const { userId, error } = await getAuthenticatedUserId(request);

  if (error || !userId) {
    return NextResponse.json(
      { message: error || "Unauthorized" },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { message: "Invalid user ID format from token" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching user profile:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await connectDB();

  const { userId, error } = await getAuthenticatedUserId(request);

  if (error || !userId) {
    return NextResponse.json(
      { message: error || "Unauthorized" },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { message: "Invalid user ID format from token" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { password, email, refreshToken, ...updates } = body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating user profile:", err);
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", errors: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await connectDB();

  const { userId, error } = await getAuthenticatedUserId(request);

  if (error || !userId) {
    return NextResponse.json(
      { message: error || "Unauthorized" },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { message: "Invalid user ID format from token" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  } catch (err: any) {
    console.error("Error deleting user account:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
