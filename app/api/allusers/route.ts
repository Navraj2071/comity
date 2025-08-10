export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { authenticateUser, createNotification } from "@/lib/utilities";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  const allUsers = await User.find().select("-password -refreshToken");

  return NextResponse.json({ allUsers: allUsers });
}

export async function POST(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();
  const { email, password, name, role, department } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const newUser = await User.create({
      email,
      password,
      name,
      role,
      department,
    });
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    createNotification(
      newUser._id,
      `Welcome to Comity. Your profile has been created.`,
      "low"
    );

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code == 11000) {
      return NextResponse.json(
        { message: "Email address already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "User create error: ", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  try {
    const body = await request.json();
    const { _id, email, refreshToken, ...updates } = body;
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: false, runValidators: true }
    ).select("-password -refreshToken");

    const notificationMessage = "Your profile has been updated.";

    createNotification(user._id, notificationMessage, "low");

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "User update error: ", error: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  try {
    const { _id } = await request.json();
    const user = await User.findByIdAndDelete(_id);
    return NextResponse.json({
      message: "User deleted successfully",
      user: user,
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "User delete error: ", error: error },
      { status: 500 }
    );
  }
}
