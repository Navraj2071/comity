export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { authenticateUser } from "@/lib/utilities";
import SOP from "@/lib/models/sop";
import SOPVersion from "@/lib/models/sopversion";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
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
    const newSop = await SOP.create({
      ...data,
      createdBy: user._id,
      createdDate: new Date(),
    });

    await Promise.all(
      data?.versions?.map(async (version: {}) => {
        await SOPVersion.create({
          sop: newSop._id,
          ...version,
          uploadDate: new Date(),
          uploadedBy: user._id,
          reviewStatus: "pending",
          approvalStatus: "pending",
        });
      })
    );

    return NextResponse.json(
      {
        message: "Document created successfully",
        sop: newSop,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Document create error:", error);

    return NextResponse.json(
      { message: "Document create error: ", error: error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
