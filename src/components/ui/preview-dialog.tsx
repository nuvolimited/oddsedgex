import { Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type PreviewDialogProps = {
  previewUrl: string;
  title?: string;
  alt?: string;
};

/**
 * A dialog that displays a preview of an image.
 *
 * @param {{ previewUrl: string; title?: string; alt?: string; }} props - The properties for the component.
 * @param {string} props.previewUrl - The URL of the preview to display.
 * @param {string} [props.title] - The title to display in the dialog header.
 * @param {string} [props.alt] - The alt text to use for the preview image.
 */
function PreviewDialog({
  previewUrl,
  title,
  alt,
}: Readonly<PreviewDialogProps>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* The button that triggers the dialog. */}
        <Button variant="secondary" size="icon">
          {/* The icon to display on the button. */}
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* The header of the dialog. */}
        <DialogHeader>
          {/* The title to display in the dialog header. */}
          <DialogTitle>{title ?? "Preview"}</DialogTitle>
        </DialogHeader>

        {/* The content of the dialog. */}
        <div className="flex justify-center">
          {/* The container for the preview image. */}
          <div className="h-[400px] w-full relative">
            {/* The preview image. */}
            <Image src={previewUrl} alt={alt ?? title ?? "Preview"} fill />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialog;
