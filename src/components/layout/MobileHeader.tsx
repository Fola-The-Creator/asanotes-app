"use client";

import { motion } from "motion/react";
import { Menu, ChevronLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useSettings } from "@/hooks/useSettings";
import Logo from "@/components/icons/Logo";
import type { ThemeMode } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

const THEME_OPTIONS: {
  value: ThemeMode;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const { mobileView, openMobileMenu, setMobileView } = useAppStore();
  const { settings, updateSetting } = useSettings();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync next-themes → settings store when the theme changes outside of Settings
  useEffect(() => {
    if (!mounted || !theme) return;
    const mapped = (theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system") as ThemeMode;
    if (mapped !== settings.themeMode) {
      updateSetting("themeMode", mapped);
    }
    // Only run when `theme` changes; settings.themeMode is the derived value we write
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, mounted]);

  const handleThemeChange = (mode: ThemeMode) => {
    updateSetting("themeMode", mode);
    setTheme(mode);
  };

  const activeMode = settings.themeMode;

  const ActiveIcon = mounted
    ? THEME_OPTIONS.find((o) => o.value === activeMode)?.icon ?? Sun
    : Sun;

  const handleBack = () => {
    setMobileView("list");
  };

  return (
    <header className="lg:hidden flex items-center justify-between h-14 px-3 border-b border-grey-200 bg-grey-50 shrink-0">
      {/* Left: Menu or Back */}
      <div className="flex items-center">
        {mobileView === "list" ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={openMobileMenu}
            className="w-10 h-10 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="w-10 h-10 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Center: Logo or Title */}
      <div className="flex-1 flex justify-center">
        {mobileView === "list" ? (
          <Logo className="w-20 fill-grey-900" />
        ) : title ? (
          <motion.p
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-grey-900 truncate max-w-[180px]"
          >
            {title}
          </motion.p>
        ) : (
          <Logo className="w-20 fill-grey-900" />
        )}
      </div>

      {/* Theme selector popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
            aria-label="Change theme"
          >
            <ActiveIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-44 p-1.5">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = activeMode === value;
            return (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent-500/10 text-accent-500"
                    : "text-grey-700 hover:bg-grey-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isActive && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </header>
  );
}
