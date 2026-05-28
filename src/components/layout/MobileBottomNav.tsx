"use client";

import { motion, AnimatePresence } from "motion/react";
import { FileText, Star, Plus, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useSelectionStore } from "@/store/useSelectionStore";
import { useCreateNote } from "@/hooks";
import type { ViewType } from "@/types";
import type React from "react";

const NAV_ITEMS: { id: ViewType; icon: React.ElementType; label: string }[] = [
  { id: "all", icon: FileText, label: "Notes" },
  { id: "favorites", icon: Star, label: "Favorites" },
];

export function MobileBottomNav() {
  const {
    viewType,
    setViewType,
    mobileView,
    selectedFolderId,
    toggleCommandPalette,
    openMobileMenu,
  } = useAppStore();

  const { selectionMode } = useSelectionStore();
  const createNote = useCreateNote();

  // Hide the nav in editor view or during multi-select
  const isHidden = mobileView === "editor" || selectionMode;

  const handleNewNote = () => {
    createNote.mutate({ folderId: null });
  };

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-1"
        >
          <div className="glass rounded-2xl shadow-float flex items-center px-2 py-1.5 gap-1">
            {/* Left nav items */}
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={viewType === item.id && mobileView === "list"}
                onClick={() => {
                  setViewType(item.id);
                }}
              />
            ))}

            {/* Center — New Note accent button */}
            <div className="flex-1 flex flex-col items-center gap-0.5 py-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleNewNote}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent-500 text-white transition-opacity active:opacity-80"
                aria-label="New note"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search */}
            <MobileNavItem
              icon={Search}
              label="Search"
              isActive={false}
              onClick={toggleCommandPalette}
            />

            {/* Menu — opens mobile sidebar (folders, tags, archive, trash) */}
            <MobileNavItem
              icon={Menu}
              label="More"
              isActive={false}
              onClick={openMobileMenu}
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function MobileNavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0.5 py-1.5"
    >
      <div
        className={cn(
          "w-6 h-6 flex items-center justify-center transition-colors duration-150",
          isActive ? "text-accent-500" : "text-grey-400",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span
        className={cn(
          "text-[10px] font-medium transition-colors duration-150",
          isActive ? "text-accent-500" : "text-grey-400",
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}
