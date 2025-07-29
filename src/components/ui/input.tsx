import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex w-full h-14 rounded-xl border border-[#2C2F36] bg-white px-4 py-3 text-base placeholder-[#9CA3AF] text-black",
        "focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
