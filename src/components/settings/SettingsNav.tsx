"use client";

import { Palette, Type, Zap, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTab = "appearance" | "editor" | "behavior" | "notes" | "account";

const NAV_ITEMS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "editor", label: "Editor", icon: Type },
  { id: "behavior", label: "Behavior", icon: Zap },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "account", label: "Account", icon: User },
];

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
//  When true, renders as a horizontal tab bar for mobile
  horizontal?: boolean;
}

export function SettingsNav({ activeTab, onTabChange, horizontal = false }: SettingsNavProps) {
  if (horizontal) {
    return (
      <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-150 shrink-0",
                isActive
                  ? "bg-grey-200 text-grey-900"
                  : "text-grey-500 hover:bg-grey-100 hover:text-grey-700",
              )}
              aria-selected={isActive}
              role="tab"
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5 p-2" role="tablist" aria-label="Settings tabs">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 text-left w-full",
              isActive
                ? "bg-grey-200 text-grey-900 font-medium"
                : "text-grey-600 hover:bg-grey-100 hover:text-grey-900",
            )}
            aria-selected={isActive}
            role="tab"
          >
            <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-accent-500" : "text-grey-400")} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
