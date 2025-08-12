import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const classes =
    "flex w-full min-h-[120px] rounded-xl px-4 py-3 text-base md:text-sm resize-none " +
    "bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] " +
    "text-[var(--filter-text)] placeholder-[var(--filter-placeholder)] " +
    "focus:outline-none focus:ring-2 focus:border-[#3B82F6] " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return <textarea ref={ref} className={cn(classes, className)} {...props} />;
});

Textarea.displayName = "Textarea";

export { Textarea };
