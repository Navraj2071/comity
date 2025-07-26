import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { getUser } from "@/lib/utilities";
import SOPVersion from "@/lib/models/sopversion";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "No access token provided" },
      { status: 401 }
    );
  }
  let user;
  try {
    user = await getUser(accessToken);
  } catch (e) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "No access token provided" },
      { status: 401 }
    );
  }

  try {
    await getUser(accessToken);
  } catch (e) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "No access token provided" },
      { status: 401 }
    );
  }

  try {
    await getUser(accessToken);
  } catch (e) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
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
