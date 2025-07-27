import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Observation from "@/lib/models/observation";
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

  const observations = await Observation.find();

  return NextResponse.json({ observations });
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
