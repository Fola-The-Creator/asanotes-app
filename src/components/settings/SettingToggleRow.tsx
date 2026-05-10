"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SettingToggleRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  id: string;
  className?: string;
}

export function SettingToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  id,
  className,
}: SettingToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3 border-b border-grey-100 last:border-0",
        className,
      )}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <Icon className="w-4 h-4 text-grey-500 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <label
            htmlFor={id}
            className="text-sm font-medium text-grey-800 cursor-pointer select-none"
          >
            {label}
          </label>
          <p className="text-xs text-grey-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-accent-500" : "bg-grey-300",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0",
            "transition-transform duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
