"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";

// Minimum horizontal swipe distance (px) to register as "open" gesture
const SWIPE_THRESHOLD = 60;

export function MobileSidebar() {
  const { mobileMenuOpen, closeMobileMenu, openMobileMenu } = useAppStore();

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeMobileMenu]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Swipe-from-left-edge gesture to open
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // Only open if: moved mostly horizontal and far enough
      if (
        !mobileMenuOpen &&
        deltaX >= SWIPE_THRESHOLD &&
        deltaY < deltaX * 0.7
      ) {
        openMobileMenu();
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [mobileMenuOpen, openMobileMenu],
  );

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
          />

          {/* Sidebar drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] h-full"
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
