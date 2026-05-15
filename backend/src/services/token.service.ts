import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { IUser } from "../models/User.model";

export function generateAccessToken(user: IUser): string {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as any }
  );
}

export function generateRefreshToken(user: IUser): string {
  return jwt.sign(
    { _id: user._id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as any }
  );
}

export function verifyRefreshToken(token: string): { _id: string } {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as { _id: string };
}
