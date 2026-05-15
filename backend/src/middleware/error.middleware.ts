import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      success: false,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values((err as any).errors).map((e: any) => e.message);
    res.status(400).json({
      statusCode: 400,
      message: "Validation Error",
      errors: messages,
      success: false,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    res.status(409).json({
      statusCode: 409,
      message: `Duplicate value for '${field}'`,
      errors: [`${field} already exists`],
      success: false,
    });
    return;
  }

  // Multer errors
  if (err.name === "MulterError") {
    const multerErr = err as any;
    let message = "File upload error";
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 5MB";
    }
    res.status(400).json({
      statusCode: 400,
      message,
      errors: [message],
      success: false,
    });
    return;
  }

  // Fallback
  console.error("Unhandled error:", err);
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    errors: [process.env.NODE_ENV === "development" ? err.message : "Something went wrong"],
    success: false,
  });
};
