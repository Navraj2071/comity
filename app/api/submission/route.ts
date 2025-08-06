import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Submission from "@/lib/models/submission";
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

  const submissions = await Submission.find();

  return NextResponse.json({ submissions });
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
    const newSubmission = await Submission.create({
      ...data,
      submittedBy: user._id,
    });

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission: newSubmission,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Submission create error:", error);

    return NextResponse.json(
      { message: "Submission create error: ", error: error },
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

    const { _id, submittedBy, ...updates } = body;

    const submission = await Submission.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Submission updated successfully",
      submission,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "Submission update error: ", error: error },
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
    const submission = await Submission.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Submission delete error: ", error: error },
      { status: 500 }
    );
  }
}
