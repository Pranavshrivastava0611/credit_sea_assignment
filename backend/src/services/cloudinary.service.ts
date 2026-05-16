import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "../config/env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  originalFilename: string;
}

/**
 * Upload a file buffer to Cloudinary.
 * Uses the `salary-slips` folder for organization.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  originalName: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lms-salary-slips",
        resource_type: "auto",
        public_id: `salary-slip-${Date.now()}`,
        // Preserve the original filename in metadata
        context: `original_name=${originalName}`,
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          originalFilename: originalName,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by its public ID.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
