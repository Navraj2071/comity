import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { authenticateUser } from "@/lib/utilities";
import SOPVersion from "@/lib/models/sopversion";

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
    const version = await SOPVersion.create({
      ...data,
      uploadDate: new Date(),
      uploadedBy: user._id,
      reviewStatus: "pending",
      approvalStatus: "pending",
    });

    return NextResponse.json(
      {
        message: "Version created successfully",
        version: version,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Version create error:", error);

    return NextResponse.json(
      { message: "Version create error: ", error: error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const { _id, ...updates } = body;

    const version = await SOPVersion.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Version updated successfully",
      version,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "Version update error: ", error: error },
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
    await SOPVersion.findByIdAndDelete(_id);

    return NextResponse.json({ message: "Version deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Version delete error: ", error: error },
      { status: 500 }
    );
  }
}
