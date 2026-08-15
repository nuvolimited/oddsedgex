import { uploadImage } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to the /api/media endpoint for uploading images to Cloudinary.
 *
 * The request is expected to contain form data with a 'file' field, which is
 * the file to be uploaded to Cloudinary.
 *
 * @param request - The NextRequest object containing the form data.
 * @returns A JSON response with the uploaded image URL or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Check if the file is provided
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Upload the file to Cloudinary
    const url = await uploadImage(file);

    // Return the uploaded image URL
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    const message = (error as Error).message;

    // Map specific errors to appropriate status codes
    if (
      message.includes("Invalid file type") ||
      message.includes("No file provided") ||
      message.includes("File size exceeds")
    ) {
      // 400 Bad Request for invalid file types, no file provided, or file size exceeds
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // 500 Internal Server Error for any other errors
    return NextResponse.json(
      { error: "Failed to upload image to Cloudinary." },
      { status: 500 }
    );
  }
}
