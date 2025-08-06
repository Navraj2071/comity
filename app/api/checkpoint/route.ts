import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Checkpoint from "@/lib/models/checkpoint";
import SubCheckpoint from "@/lib/models/subcheckpoint";
import { authenticateUser, createNotification } from "@/lib/utilities";
import Department from "@/lib/models/department";
import User from "@/lib/models/user";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser();

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  const checkpoints = await Checkpoint.find();
  const returnArray = <any[]>[];
  await Promise.all(
    checkpoints.map(async (checkpoint) => {
      const subcheckpoints = await SubCheckpoint.find({
        checkpoint: checkpoint._id,
      });
      returnArray.push({
        ...checkpoint.toObject(),
        subCheckpoints: subcheckpoints,
      });
    })
  );

  return NextResponse.json({ checkpoints: returnArray });
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
    const newCheckpoint = await Checkpoint.create({
      ...data,
      createdBy: user._id,
    });

    await Promise.all(
      data?.subCheckpoints?.map(async (subpoint: any) => {
        const spoint = await SubCheckpoint.create({
          checkpoint: newCheckpoint._id,
          ...subpoint,
        });

        Department.findById(spoint.department).then((DepRes) => {
          User.findById(DepRes.spoc).then((userRes) => {
            createNotification(
              userRes._id,
              `A new Checkpoint has been created for your Department (${DepRes.name}).\n\nTitle: ${spoint.title}\n\nThe checkpoint has been assigned to you because you are the SPOC of your department.`,
              "low"
            );
          });
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
