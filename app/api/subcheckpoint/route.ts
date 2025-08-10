import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import SubCheckpoint from "@/lib/models/subcheckpoint";
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

  const SubCheckpoints = await SubCheckpoint.find();

  return NextResponse.json({ SubCheckpoints });
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

    const { _id, ...updates } = body;

    const subCheckpoint = await SubCheckpoint.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if ("assignedTo" in updates) {
      createNotification(
        updates.assignedTo,
        `A compliance checkpoint has been assigned to you by the SPOC of your department.\nTitle: ${subCheckpoint.title}`,
        "low"
      );
    }

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
