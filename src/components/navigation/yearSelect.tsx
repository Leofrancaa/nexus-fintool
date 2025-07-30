"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Calendar, Check, ChevronDown, ChevronUp } from "lucide-react";

// Utils
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// Componentes base
const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-md border border-[#3B3B3B] bg-[#1B1B1B] px-4 py-2 text-sm text-white shadow-sm transition-all focus:border-[#335fef] focus:ring-2 focus:ring-[#335fef]/30",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-[#335fef]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 mt-1 overflow-hidden rounded-md border border-[#2F2F2F] bg-[#1B1B1B] shadow-md max-h-60 text-white",
        className
      )}
      position="popper"
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex justify-center py-1">
        <ChevronUp className="h-4 w-4 text-[#335fef]" />
      </SelectPrimitive.ScrollUpButton>

      <SelectPrimitive.Viewport
        className="p-1"
        style={{ width: "var(--radix-select-trigger-width)" }}
      >
        {children}
      </SelectPrimitive.Viewport>

      <SelectPrimitive.ScrollDownButton className="flex justify-center py-1">
        <ChevronDown className="h-4 w-4 text-[#335fef]" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className = "", ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center justify-between rounded-md px-4 py-2 text-sm text-white hover:bg-[#2e2e2e] focus:bg-[#2e2e2e] focus:outline-none",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2">
      <Check className="h-4 w-4 text-[#335fef]" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectValue = SelectPrimitive.Value;

// Componente YearSelect adaptado
interface YearSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const YearSelect: React.FC<YearSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Escolha o ano",
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) =>
    (currentYear - 5 + i).toString()
  );

  return (
    <div className="space-y-2 w-full max-w-[240px]">
      <label className="text-sm font-medium text-white flex items-center gap-2">
        <Calendar className="h-4 w-4 text-[#335fef]" />
        Ano
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              <div className="flex justify-between w-full">
                <span>{year}</span>
                {parseInt(year) === currentYear && (
                  <span className="text-xs text-[#335fef] bg-[#335fef]/10 px-2 py-0.5 rounded-full ml-2">
                    Atual
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
