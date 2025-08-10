import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Department from "@/lib/models/department";
import { authenticateUser } from "@/lib/utilities";

export async function GET(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  const departments = await Department.find();

  return NextResponse.json({ departments });
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
  const { name, head, spoc } = await request.json();

  if (!name || !head || !spoc) {
    return NextResponse.json(
      { message: "Name, Head and SPOC values are required." },
      { status: 400 }
    );
  }

  try {
    const newDepartment = await Department.create({
      name,
      head,
      spoc,
    });

    return NextResponse.json(
      { message: "Department created successfully", department: newDepartment },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(Department);
    console.error("Department create error:", error);

    return NextResponse.json(
      { message: "Department create error: ", error: error },
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

    const { _id, userCount, activeCheckpoints, ...updates } = body;

    const department = await Department.findByIdAndUpdate(
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
    const user = await Department.findByIdAndDelete(_id);
    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      { message: "Department delete error: ", error: error },
      { status: 500 }
    );
  }
}
