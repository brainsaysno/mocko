import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function P({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}
