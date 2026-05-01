"use client";

import { motion } from "motion/react";
import { Menu, ChevronLeft, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import Logo from "@/components/icons/Logo";

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const { mobileView, openMobileMenu, setMobileView } = useAppStore();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="w-4 h-4" />;
    if (theme === "light") return <Moon className="w-4 h-4" />;
    if (theme === "dark") return <Monitor className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

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

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(nextTheme)}
        className="w-10 h-10 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
      </Button>
    </header>
  );
}
