import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { CommandItem } from "../hooks/useCommandItems";

interface CommandPaletteItemProps {
  item: CommandItem;
  currentIndex: number;
  selectedIndex: number;
  onMouseEnter: () => void;
}

export function CommandPaletteItem({
  item,
  currentIndex,
  selectedIndex,
  onMouseEnter,
}: CommandPaletteItemProps) {
  const isSelected = currentIndex === selectedIndex;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={item.action}
      onMouseEnter={onMouseEnter}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
        isSelected
          ? "bg-accent-500/10 text-grey-900"
          : "text-grey-700 hover:bg-grey-100",
      )}
    >
      <item.icon
        className={cn(
          "w-4 h-4 shrink-0",
          isSelected ? "text-accent-500" : "text-grey-500",
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.label}</p>
        {item.description && (
          <p className="text-xs text-grey-500 truncate">{item.description}</p>
        )}
      </div>
      {isSelected && (
        <kbd className="text-xs bg-grey-200 px-1.5 py-0.5 rounded text-grey-500">
          Enter
        </kbd>
      )}
    </motion.button>
  );
}
