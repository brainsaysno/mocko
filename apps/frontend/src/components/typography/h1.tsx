import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function H1({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
