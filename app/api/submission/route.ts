import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Submission from "@/lib/models/submission";
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

  const submissions = await Submission.find();

  return NextResponse.json({ submissions });
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
