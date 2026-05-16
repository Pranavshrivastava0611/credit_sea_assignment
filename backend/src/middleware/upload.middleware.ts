import multer from "multer";
import { ApiError } from "../utils/ApiError";

// Use memory storage — files are buffered in memory then uploaded to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only PDF, JPG, and PNG files are allowed") as any);
  }
};

export const uploadSalarySlip = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("salarySlip");
