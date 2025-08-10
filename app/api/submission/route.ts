import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Submission from "@/lib/models/submission";
import { authenticateUser, createNotification } from "@/lib/utilities";
import Department from "@/lib/models/department";
import SubCheckpoint from "@/lib/models/subcheckpoint";
import User from "@/lib/models/user";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser(request);

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
    const newSubmission = await Submission.create({
      ...data,
      submittedBy: user._id,
    });

    if (data.status === "pending_review") {
      SubCheckpoint.findById(newSubmission.subCheckpoint)
        .then((subpoint) => {
          Department.findById(subpoint.department)
            .then((dept) => {
              User.findById(dept.head)
                .then((user) => {
                  const notificationMessage = `A new compliance submission requires your review.\n\nTitle: ${subpoint.title}\n\nYou are receiving this message because you are the HOD of your department.`;

                  createNotification(user._id, notificationMessage, "low");
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }

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
