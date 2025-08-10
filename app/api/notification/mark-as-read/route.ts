import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/notification";
import { authenticateUser } from "@/lib/utilities";

export async function PATCH(request: Request) {
  const { user, message, error } = await authenticateUser(request);

  if (error || !user) {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  await connectDB();

  const { _id } = await request.json();

  const notification = await Notification.findOneAndUpdate(
    {
      _id: _id,
      user: user._id,
    },
    { $set: { read: true } }
  );

  return NextResponse.json({ notification });
}
