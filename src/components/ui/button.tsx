import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "w-full flex justify-center items-center rounded-xl font-semibold transition-all py-6 text-lg cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white hover:opacity-90",
    secondary: "bg-[#1F2937] text-white hover:bg-[#374151]",
    ghost:
      "bg-transparent border border-[#4B5563] text-[#D1D5DB] hover:bg-[#1F2937]",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
