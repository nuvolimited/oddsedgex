import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JSX, ReactNode } from "react";

type InfoCardProps = {
  title: string;
  content: ReactNode;
  className?: string;
};

/**
 * A component to display information in a card format.
 *
 * @param {InfoCardProps} props - The properties for the component.
 * @param {string} props.title - The title to display in the card header.
 * @param {ReactNode} props.content - The content to display in the card body.
 * @param {string} [props.className] - The CSS class name to apply to the outermost
 * element.
 * @returns {JSX.Element} The rendered component.
 */
export function InfoCard({
  title,
  content,
  className,
}: Readonly<InfoCardProps>): JSX.Element {
  return (
    <Card className={cn("relative", className)}>
      {/* The title of the card. */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {/* The content of the card. */}
      <CardContent>{content}</CardContent>
    </Card>
  );
}
