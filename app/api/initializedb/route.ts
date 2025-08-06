import { NextResponse } from "next/server";
import Department from "@/lib/models/department";
import User from "@/lib/models/user";
import Notification from "@/lib/models/notification";
import connectDB from "@/lib/db";

export const GET = async (request: Request) => {
  const db = await connectDB();

  const { searchParams } = new URL(request.url);

  const departments = [
    { name: "IT" },
    { name: "Operations" },
    { name: "Legal and Compliance" },
    { name: "Human Resources" },
    { name: "Finance" },
    { name: "Compliance" },
  ];

  const user = {
    name: "Navraj Sharma",
    role: "Super-user",
    email: "navraj@comity.com",
    password: "1234",
  };

  const notifications = [
    { message: "This is notification 1", severity: "low" },
    { message: "This is notification 2", severity: "medium" },
    { message: "This is notification 3", severity: "high" },
    { message: "This is notification 4", severity: "high" },
    { message: "This is notification 5", severity: "medium" },
  ];

  if (searchParams.get("pass") === "4466") {
    await Promise.all(
      departments.map(async (dept) => {
        await Department.create(dept)
          .then((res) => console.log(`Created department: ${dept.name}`))
          .catch((err) =>
            console.log(`Error creating department: ${dept.name}`)
          );
      })
    );

    const newUser = (await User.create(user)
      .then((res) => {
        console.log("user created", res);
        return res;
      })
      .catch((err) => console.log("Error creating user: ", err))) as any;

    await Promise.all(
      notifications.map(async (noti) => {
        await Notification.create({ user: newUser._id, ...noti });
      })
    );
  } else {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }

  return NextResponse.json({ status: "Success" });
};
