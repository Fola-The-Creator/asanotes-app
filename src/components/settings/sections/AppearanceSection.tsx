"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import type { ThemeMode } from "@/types";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ElementType; description: string }[] = [
  { value: "light", label: "Light", icon: Sun, description: "Always use light mode" },
  { value: "dark", label: "Dark", description: "Always use dark mode", icon: Moon },
  { value: "system", label: "System", icon: Monitor, description: "Follow system preference" },
];

export function AppearanceSection() {
  const { settings, updateSetting } = useSettings();
  const { setTheme } = useTheme();

  function handleThemeChange(mode: ThemeMode) {
    updateSetting("themeMode", mode);
    const themeMap: Record<ThemeMode, string> = {
      light: "light",
      dark: "dark",
      system: "system",
    };
    setTheme(themeMap[mode]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900 mb-1">Appearance</h3>
        <p className="text-xs text-grey-500 mb-4">
          Choose how Asanote looks to you. Changes apply instantly.
        </p>

        {/* Theme picker */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-grey-600 uppercase tracking-wide">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon, description }) => {
              const isActive = settings.themeMode === value;
              return (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={`
                    relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 text-left
                    ${isActive
                      ? "border-accent-500 bg-accent-500/8 text-grey-900"
                      : "border-grey-200 bg-grey-100 text-grey-600 hover:border-grey-300 hover:bg-grey-200"
                    }
                  `}
                  aria-label={`Set theme to ${label}`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? "text-accent-500" : "text-grey-500"}`} />
                  <div className="text-center min-w-0">
                    <p className={`text-xs font-semibold ${isActive ? "text-grey-900" : "text-grey-700"}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-grey-500 mt-0.5 leading-tight hidden sm:block">
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
