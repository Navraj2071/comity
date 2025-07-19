import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(request: Request) {
  await connectDB();
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get("refreshToken")?.value;

  if (!oldRefreshToken) {
    return NextResponse.json(
      { message: "No refresh token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: string };

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== oldRefreshToken) {
      const response = NextResponse.json(
        { message: "Invalid refresh token, please login again" },
        { status: 401 }
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
      return response;
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    const response = NextResponse.json(
      { message: "Access token refreshed" },
      { status: 200 }
    );
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error("Refresh token verification failed:", error);
    const response = NextResponse.json(
      { message: "Invalid refresh token, please login again" },
      { status: 401 }
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}
