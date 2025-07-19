// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(request: Request) {
  await connectDB();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    } catch (error) {
      console.error("Error clearing refresh token from DB:", error);
    }
  }

  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}
