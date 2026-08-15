"use client";

import { Loader, Plus, Trash } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadResponse {
  url?: string;
  error?: string;
}

/**
 * Uploads an image to Cloudinary using the `fetch` API.
 * @param url The URL to upload the image to.
 * @param arg The form data containing the image to upload.
 * @returns A promise that resolves to an object with an `url` property
 * containing the URL of the uploaded image, or an `error` property containing
 * an error message if the upload fails.
 */
async function uploadImage(
  url: string,
  { arg }: { arg: FormData }
): Promise<UploadResponse> {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
  });

  if (!response.ok) {
    // If the response is not OK, try to parse the error message from the response
    const errorData = await response.json();
    if (response.status === 500) {
      // If the server returns a 500 status code, throw a generic error
      throw new Error(
        "Server error: Failed to upload image to Cloudinary. Please try again later."
      );
    }
    // Otherwise, throw an error with the error message from the response
    throw new Error(errorData.error ?? "Upload failed");
  }

  // If the response is OK, return the URL of the uploaded image
  return response.json();
}

type ImageUploaderProps = {
  onValueChange?: (value: string) => void;
  id: string;
};

/**
 * A component that allows users to upload an image to Cloudinary.
 * @param props The properties of the component.
 * @prop {string} id The ID of the component.
 * @prop {(value: string) => void} onValueChange The callback to call when the value of the component changes.
 */
function ImageUploader({ onValueChange, id }: Readonly<ImageUploaderProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { trigger, isMutating } = useSWRMutation("/api/media", uploadImage, {
    onError: (err) => {
      toast.error("Image upload failed", {
        description: err.message,
      });
    },

    onSuccess: (data) => {
      if (data.url) {
        onValueChange?.(data.url);
        setIsUploaded(true);
      }
    },
  });

  /**
   * Handles file input change events.
   * Sets the selected file and generates a preview URL.
   * @param event The change event from the file input.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Get the first file from the file input
    const file = event.target.files?.[0];
    
    if (file) {
      // Update state with the selected file
      setSelectedFile(file);
      
      // Generate a preview URL for the file and update state
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handles the upload of the selected file to the server.
   * If there is no selected file, the function does nothing.
   * If there is a selected file, the function creates a new FormData object
   * and appends the selected file to it. Then, it calls the `trigger` function
   * from the `useSWRMutation` hook with the formData as an argument, which
   * will send the file to the server.
   */
  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    // Call the trigger function from the useSWRMutation hook to send the file to the server
    trigger(formData);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (preview) {
    return (
      <div className="h-32 w-full text-secondary-foreground relative">
        <Image src={preview} alt="Preview" fill className="object-cover" />
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            setSelectedFile(null);
            setPreview(null);
          }}
          className={cn(
            "absolute top-2 right-2 cursor-pointer hover:animate-pulse",
            (isMutating || isUploaded) && "hidden pointer-events-none"
          )}
          disabled={isMutating}
        >
          <Trash className="group-hover:scale-125 transition-all ease-linear duration-200 transform" />
        </Button>

        <Button
          type="button"
          className={cn("absolute bottom-0 w-full", isUploaded && "hidden")}
          onClick={handleUpload}
          disabled={isMutating}
        >
          {isMutating ? <Loader className="animate-spin" /> : "Upload"}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-32 w-full bg-secondary text-secondary-foreground relative">
      <Label
        htmlFor={id}
        className="inset-0 absolute flex items-center justify-center group cursor-pointer"
      >
        <Plus className="group-hover:scale-125 transition-all ease-linear duration-200 transform" />
      </Label>
      <Input
        type="file"
        accept="image/*"
        id={id}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export { ImageUploader };
