import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Observation from "@/lib/models/observation";
import { authenticateUser } from "@/lib/utilities";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser();

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  const observations = await Observation.find();

  return NextResponse.json({ observations });
}

export async function POST(request: Request) {
  const { user, message, error } = await authenticateUser();

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();
  const data = await request.json();

  try {
    const observation = await Observation.create({
      ...data,
      createdBy: user._id,
    });

    return NextResponse.json(
      {
        message: "Observation created successfully",
        observation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Observation create error:", error);

    return NextResponse.json(
      { message: "Observation create error: ", error: error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { user, message, error } = await authenticateUser();

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  try {
    const body = await request.json();

    const { _id, createdAt, createdBy, ...updates } = body;

    const observation = await Observation.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Observation updated successfully",
      observation,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "Observation update error: ", error: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { user, message, error } = await authenticateUser();

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  try {
    const { _id } = await request.json();
    await Observation.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Observation delete error: ", error: error },
      { status: 500 }
    );
  }
}
