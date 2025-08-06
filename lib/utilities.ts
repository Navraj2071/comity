import { jwtVerify } from "jose";
import User from "./models/user";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Notification from "./models/notification";
import nodemailer from "nodemailer";

export const getUser = async (accessToken: any) => {
  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const userId = payload.userId;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw "User not found";
    return user;
  } catch (e) {
    throw "Invalid token";
  }
};

export const tokenRefresh = async (oldRefreshToken: any) => {
  const decoded = jwt.verify(
    oldRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as { userId: string };

  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user) {
    throw "Invalid token";
  } else {
    if (user.refreshToken !== oldRefreshToken) {
      user.refreshToken = undefined;
      await user.save();
      throw "Invalid token";
    } else {
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
      return { user, newAccessToken };
    }
  }
};

export const authenticateUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let user = null as any;
  let message = "";
  let error = false;

  if (!accessToken) {
    if (!refreshToken) {
      error = true;
      message = "No access token provided";
    } else {
      await tokenRefresh(refreshToken)
        .then((res) => {
          user = res.user;
        })
        .catch((err) => {
          error = true;
          message = err;
        });
    }
  } else {
    await getUser(accessToken)
      .then((res) => {
        user = res;
      })
      .catch((err) => {
        error = true;
        message = err;
      });
  }

  return { user, message, error };
};

export const sendEmailFromNotification = async (notification: any) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const user = await User.findById(notification.user);

  console.log(`Dear ${user.name},

${notification.message}

Regards,
Comity App

This is an automatically generated email. Please do not reply.
    
    `);

  await transporter.sendMail({
    from: `"Comity" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Comity Notification ${
      notification.severity === "high" ? "Urgent!!" : ""
    }`,
    text: `Dear ${user.name},

${notification.message}

Regards,
Comity App

This is an automatically generated email. Please do not reply.
    
    `,
  });
};

export const createNotification = async (
  userId: string,
  message: string,
  severity: string
) => {
  const notification = await Notification.create({
    user: userId,
    message,
    severity,
  });

  if (notification) {
    try {
      await sendEmailFromNotification(notification);
      notification.emailSent = true;
      await notification.save();
    } catch {}
  }
};
