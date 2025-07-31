import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    const baseClasses =
      "flex w-full h-14 rounded-xl px-4 py-3 text-base placeholder-[#9CA3AF] text-black focus:outline-none focus:ring-2 focus:border-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

    const variants = {
      default:
        "bg-white border border-[#2C2F36] focus:ring-[#3B82F6] focus:border-[#3B82F6]",
      dark: "bg-[#1B1B1B] border border-[#2e2e2e] text-white placeholder-gray-400 focus:ring-[#00D4D4] focus:border-[#00D4D4]",
    };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
