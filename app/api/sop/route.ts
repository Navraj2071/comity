import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { getUser } from "@/lib/utilities";
import SOP from "@/lib/models/sop";
import SOPVersion from "@/lib/models/sopversion";

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

  const sops = await SOP.find();
  const denormalizedArray = <any[]>[];

  await Promise.all(
    sops.map(async (sop: any) => {
      const versions = await SOPVersion.find({ sop: sop._id });
      denormalizedArray.push({ ...sop.toObject(), versions: versions });
    })
  );

  return NextResponse.json({ sops: denormalizedArray });
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
    const newSop = await SOP.create({
      ...data,
    });

    await Promise.all(
      data?.versions?.map(async (version: {}) => {
        await SOPVersion.create({
          sop: newSop._id,
          ...version,
        });
      })
    );

    return NextResponse.json(
      {
        message: "Checkpoint created successfully",
        checkpoint: newSop,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Checkpoint create error:", error);

    return NextResponse.json(
      { message: "Checkpoint create error: ", error: error },
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

    const sop = await SOP.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "SOP updated successfully",
      sop,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "SOP update error: ", error: error },
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
    const sop = await SOP.findByIdAndDelete(_id);
    await SOPVersion.deleteMany({ sop: sop._id });
    return NextResponse.json({ message: "SOP deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "SOP delete error: ", error: error },
      { status: 500 }
    );
  }
}
