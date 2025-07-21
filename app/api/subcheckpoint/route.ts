import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import SubCheckpoint from "@/lib/models/subcheckpoint";
import { getUser } from "@/lib/utilities";

export async function GET(request: Request) {
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

  const SubCheckpoints = await SubCheckpoint.find();

  return NextResponse.json({ SubCheckpoints });
}

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
    const newSubCheckpoint = await SubCheckpoint.create({
      ...data,
    });

    return NextResponse.json(
      {
        message: "SubCheckpoint created successfully",
        subCheckpoint: newSubCheckpoint,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("SubCheckpoint create error:", error);

    return NextResponse.json(
      { message: "SubCheckpoint create error: ", error: error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const subCheckpoint = await SubCheckpoint.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "SubCheckpoint updated successfully",
      subCheckpoint,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "SubCheckpoint update error: ", error: error },
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
    const user = await SubCheckpoint.findByIdAndDelete(_id);
    return NextResponse.json({ message: "SubCheckpoint deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "SubCheckpoint delete error: ", error: error },
      { status: 500 }
    );
  }
}
