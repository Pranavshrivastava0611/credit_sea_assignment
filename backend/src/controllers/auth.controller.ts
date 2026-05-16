import { Request, Response } from "express";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../services/token.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { env } from "../config/env";

const IS_PROD = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/v1/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Only allow Borrower signup via public route
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "Borrower",
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(201).json(
    new ApiResponse(201, { user: userData, accessToken }, "Account created successfully")
  );
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json(new ApiResponse(200, { user: userData, accessToken }, "Login successful"));
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.json(new ApiResponse(200, null, "Logged out successfully"));
});

// POST /api/v1/auth/refresh-token
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const decoded = verifyRefreshToken(incomingRefreshToken);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    res.json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

// GET /api/v1/auth/me
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user, "Current user fetched"));
});
