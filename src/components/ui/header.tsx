import { cn } from "@/lib/utils";
import React from "react";

type HeaderProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * A basic header component.
 *
 * This component is used to display a title and any other content that
 * should be displayed at the top of a page.
 *
 * @param {{ title: string; className?: string; children: React.ReactNode; }}
 *   props - The properties for the component.
 * @prop {string} title - The title to display in the header.
 * @prop {string} [className] - Any additional classes to apply to the
 *   component.
 * @prop {React.ReactNode} children - Any children to render inside the
 *   component.
 * @returns {React.ReactElement} The rendered component.
 */
function Header({ title, className, children }: Readonly<HeaderProps>) {
  return (
    <div className={cn("border-b py-6 w-full px-4", className)}>
      {/* The title of the page. */}
      <h1>{title}</h1>
      {/* Any additional children to render. */}
      {children}
    </div>
  );
}

export default Header;
