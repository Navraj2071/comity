import { jwtVerify } from "jose";
import User from "./models/user";

export const getUser = async (accessToken: any) => {
  const { payload } = await jwtVerify(
    accessToken,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
  const userId = payload.userId;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) throw "User not found";
  return user;
};
