"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";
import { useSelectionStore } from "@/store/useSelectionStore";

/**
 * Edge-zone width (px) — the touch must start within this distance
 * from the left edge of the screen to be considered an "open sidebar" gesture.
 * This prevents accidental triggers from general scrolling / horizontal pans.
 */
const EDGE_ZONE = 24;

/** Minimum horizontal distance (px) the swipe must travel. */
const SWIPE_THRESHOLD = 70;

/**
 * Maximum ratio of vertical-to-horizontal movement allowed.
 * Lower = stricter (more horizontal required). 0.5 means vertical movement
 * must be less than 50 % of horizontal movement.
 */
const MAX_VERTICAL_RATIO = 0.5;

export function MobileSidebar() {
  const { mobileMenuOpen, mobileView, closeMobileMenu, openMobileMenu } =
    useAppStore();
  const selectionMode = useSelectionStore((s) => s.selectionMode);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  /** Whether this touch sequence started inside the left-edge zone */
  const isEdgeTouch = useRef(false);

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

  // ── Swipe-from-left-edge gesture to open ──────────────────────
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // Don't track if the sidebar is already open
      if (mobileMenuOpen) return;

      // Don't trigger while in selection mode — the user is interacting
      // with checkboxes and the bulk-action bar.
      if (selectionMode) return;

      // Don't trigger when in the editor view — horizontal swipes there
      // are typically text selection / scrolling.
      if (mobileView === "editor") return;

      const touch = e.touches[0];

      // Only consider touches that originate from the left-edge zone
      if (touch.clientX > EDGE_ZONE) return;

      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      isEdgeTouch.current = true;
    },
    [mobileMenuOpen, selectionMode, mobileView],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Ignore if this touch didn't start in the edge zone
      if (!isEdgeTouch.current) return;
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // Open only if the swipe is clearly horizontal and long enough
      if (
        !mobileMenuOpen &&
        deltaX >= SWIPE_THRESHOLD &&
        deltaY < deltaX * MAX_VERTICAL_RATIO
      ) {
        openMobileMenu();
      }

      // Reset
      touchStartX.current = null;
      touchStartY.current = null;
      isEdgeTouch.current = false;
    },
    [mobileMenuOpen, openMobileMenu],
  );

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
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
