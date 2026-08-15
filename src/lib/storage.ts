import { cloudinary } from "./cloudinary";

interface CloudinaryUploadResponse {
  secure_url: string;
}

// Maximum file size allowed for upload is 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg", // JPEG images
  "image/png", // PNG images
  "image/gif", // GIF images
  "image/webp", // WEBP images
];

/**
 * Uploads an image file to Cloudinary and returns its secure URL.
 * @param file - The image file to upload.
 * @returns A promise resolving to the secure URL of the uploaded image.
 * @throws Error if the upload fails, file is invalid, or exceeds size limit.
 *
 * This function validates the file, then converts it to a buffer and uploads it
 * to Cloudinary using the `upload_stream` method. The method returns a promise
 * that resolves to the Cloudinary response object containing the secure URL of
 * the uploaded image.
 */
export async function uploadImage(file: File): Promise<string> {
  // Validate file
  if (!file) {
    throw new Error("No file provided.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP are supported."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`
    );
  }

  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    // Upload to Cloudinary using a buffer
    const response = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            // Specifying resource_type as "image" ensures that Cloudinary
            // processes the image as an image, not as a raw file.
            resource_type: "image",
            // The folder to upload the image to. This will be used to
            // construct the public_id of the uploaded image.
            folder: "OddsEdgeX",
          },
          (error, result) => {
            if (error || !result) {
              reject(
                new Error(
                  error?.message ??
                    "Cloudinary upload failed, but no error message was provided."
                )
              );
            } else {
              resolve(result as CloudinaryUploadResponse);
            }
          }
        );
        uploadStream.end(bufferData);
      }
    );

    return response.secure_url;
  } catch (error) {
    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}
