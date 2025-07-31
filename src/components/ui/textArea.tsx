import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "dark";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses =
      "flex w-full min-h-[120px] rounded-xl px-4 py-3 text-base placeholder-[#9CA3AF] focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none";

    const variants = {
      default:
        "bg-white text-black border border-[#2C2F36] focus:ring-[#3B82F6] focus:border-[#3B82F6]",
      dark: "bg-[#1B1B1B] text-white border border-[#2e2e2e] placeholder-gray-400 focus:ring-[#00D4D4] focus:border-[#00D4D4]",
    };

    return (
      <textarea
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
