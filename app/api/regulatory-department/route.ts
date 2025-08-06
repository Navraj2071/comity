import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import RegulatoryDepartment from "@/lib/models/regulatorydepartment";
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

  const departments = await RegulatoryDepartment.find();

  return NextResponse.json({ regulatoryDepartments: departments });
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
  const { name, fullName, criticality, spoc, description } =
    await request.json();

  if (!name || !fullName || !criticality || !spoc || !description) {
    return NextResponse.json(
      {
        message:
          "Name, fullName, criticality, spoc, description values are required.",
      },
      { status: 400 }
    );
  }

  try {
    const newRegulatoryDepartment = await RegulatoryDepartment.create({
      name,
      fullName,
      criticality,
      spoc,
      description,
      createdBy: user._id,
    });

    return NextResponse.json(
      {
        message: "Department created successfully",
        department: newRegulatoryDepartment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(RegulatoryDepartment);
    console.error("Department create error:", error);

    return NextResponse.json(
      { message: "Department create error: ", error: error },
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

    const { _id, createdAt, createdBy, ...updates } = body;

    const department = await RegulatoryDepartment.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    return NextResponse.json(
      { message: "Department update error: ", error: error },
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
    const user = await RegulatoryDepartment.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Department delete error: ", error: error },
      { status: 500 }
    );
  }
}
