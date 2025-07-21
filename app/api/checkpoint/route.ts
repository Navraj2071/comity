import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Checkpoint from "@/lib/models/checkpoint";
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

  const checkpoints = await Checkpoint.find();
  const returnArray = <any[]>[];
  await Promise.all(
    checkpoints.map(async (checkpoint) => {
      console.log(checkpoint);
      const subcheckpoints = await SubCheckpoint.find({
        checkpoint: checkpoint._id,
      });
      returnArray.push({
        ...checkpoint.toObject(),
        subCheckpoints: subcheckpoints,
      });
    })
  );

  console.log(returnArray);

  return NextResponse.json({ checkpoints: returnArray });
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
    const newCheckpoint = await Checkpoint.create({
      ...data,
    });

    await Promise.all(
      data?.subCheckpoints?.map(async (subpoint: {}) => {
        await SubCheckpoint.create({
          checkpoint: newCheckpoint._id,
          ...subpoint,
        });
      })
    );

    return NextResponse.json(
      {
        message: "Checkpoint created successfully",
        checkpoint: newCheckpoint,
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

    const checkpoint = await Checkpoint.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Checkpoint updated successfully",
      checkpoint,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "Checkpoint update error: ", error: error },
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
    const checkpoint = await Checkpoint.findByIdAndDelete(_id);
    await SubCheckpoint.deleteMany({ checkpoint: checkpoint._id });
    return NextResponse.json({ message: "Checkpoint deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Checkpoint delete error: ", error: error },
      { status: 500 }
    );
  }
}
