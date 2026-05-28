"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import Logo from "@/components/icons/Logo";

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const { mobileView, setMobileView } = useAppStore();

  const handleBack = () => {
    setMobileView("list");
  };

  return (
    <header className="lg:hidden flex items-center h-12 px-2 border-b border-grey-200/60 bg-grey-50/90 backdrop-blur-md shrink-0">
      {/* Left: Back button in editor, nothing in list */}
      <div className="w-10 flex items-center">
        <AnimatePresence mode="wait">
          {mobileView === "editor" && (
            <motion.div
              key="back"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ type: "spring", damping: 28, stiffness: 400 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="w-9 h-9 text-grey-500 hover:text-grey-900 hover:bg-grey-200/70 rounded-md"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: Logo in list, note title in editor */}
      <div className="flex-1 flex justify-center">
        <AnimatePresence mode="wait">
          {mobileView === "list" ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Logo className="w-20 fill-grey-900" />
            </motion.div>
          ) : title ? (
            <motion.p
              key={title}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="text-[14px] font-semibold text-grey-900 truncate max-w-[200px]"
            >
              {title}
            </motion.p>
          ) : (
            <motion.div
              key="logo-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Logo className="w-20 fill-grey-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: empty spacer for centering */}
      <div className="w-10" />
    </header>
  );
}
