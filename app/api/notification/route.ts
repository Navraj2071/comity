export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/notification";
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

  const notifications = await Notification.find({
    user: user._id,
    read: false,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ notifications });
}
