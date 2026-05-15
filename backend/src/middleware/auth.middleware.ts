import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyJWT = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized — no token provided");
    }

    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as { _id: string };
      const user = await User.findById(decoded._id).select("-password -refreshToken");

      if (!user) {
        throw new ApiError(401, "Invalid token — user not found");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Invalid or expired token");
    }
  }
);
