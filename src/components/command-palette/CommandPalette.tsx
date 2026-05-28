"use client";

import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCommandItems } from "./hooks/useCommandItems";
import { CommandPaletteItem } from "./ui/CommandPaletteItem";

const typeLabels: Record<string, string> = {
  action: "Actions",
  note: "Notes",
  folder: "Folders",
  tag: "Tags",
};

export function CommandPalette() {
  const {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    groupedItems,
    commandPaletteOpen,
    toggleCommandPalette,
  } = useCommandItems();

  let flatIndex = 0;

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={toggleCommandPalette}>
      <DialogContent
        showCloseButton={false}
        className="
          max-w-xl w-[85%] p-0 gap-0 bg-grey-50 border-grey-200 overflow-hidden flex flex-col
          top-[10%] translate-y-0 max-h-[600px]
          sm:top-[50%] sm:-translate-y-1/2 sm:max-h-[600px]
        "
      >
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>

        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-grey-200 shrink-0">
          <Search className="w-4 h-4 text-grey-500 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, folders, actions..."
            className="border-none bg-transparent! p-0 h-auto focus-visible:ring-0 text-grey-900 placeholder:text-grey-500 min-w-0"
            autoFocus
          />
          {/* Clickable ESC label — useful on mobile where there's no physical key */}
          <button
            onClick={() => toggleCommandPalette()}
            className="text-xs bg-grey-200 hover:bg-grey-300 px-1.5 py-0.5 rounded text-grey-500 shrink-0 transition-colors"
            aria-label="Close"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center text-sm text-grey-500"
                >
                  No results found for &quot;{query}&quot;
                </motion.div>
              ) : (
                Object.entries(groupedItems).map(
                  ([type, items]) =>
                    items.length > 0 && (
                      <div key={type} className="mb-2">
                        <div className="px-2 py-1 text-xs font-medium text-grey-500 uppercase tracking-wider">
                          {typeLabels[type]}
                        </div>
                        {items.map((item) => {
                          const currentIndex = flatIndex++;
                          return (
                            <CommandPaletteItem
                              key={item.id}
                              item={item}
                              currentIndex={currentIndex}
                              selectedIndex={selectedIndex}
                              onMouseEnter={() =>
                                setSelectedIndex(currentIndex)
                              }
                            />
                          );
                        })}
                      </div>
                    ),
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer hints — hidden on very small screens */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-grey-200 text-xs text-grey-500 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-grey-200 px-1 rounded">↑</kbd>
              <kbd className="bg-grey-200 px-1 rounded">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-grey-200 px-1 rounded">Enter</kbd>
              <span>select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="bg-grey-200 px-1 rounded">Ctrl</kbd>
            <kbd className="bg-grey-200 px-1 rounded">K</kbd>
            <span>open</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
