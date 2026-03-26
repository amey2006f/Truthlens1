"use client";

import type { ComponentProps, CSSProperties } from "react";
import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner } from "sonner@2.0.3";
import { cn } from "./utils";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ theme: themeProp, className, style, ...rest }: ToasterProps) => {
  const { theme: ctxTheme } = useTheme();
  const theme = (themeProp ?? ctxTheme ?? "system") as "light" | "dark" | "system";

  return (
    <Sonner
      {...rest}
      theme={theme}
      className={cn("toaster group", className)}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...style,
        } as CSSProperties
      }
    />
  );
};

export { Toaster };
