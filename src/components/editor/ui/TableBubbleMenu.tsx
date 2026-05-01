"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BubbleMenu as TiptapBubbleMenu, type Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "motion/react";
import {
  TableRowsSplit,
  TableColumnsSplit,
  Trash2,
  Rows3,
  Columns3,
  ChevronDown,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TableBubbleMenuProps {
  editor: Editor | null;
}

interface TableAction {
  icon: React.ElementType;
  label: string;
  action: () => void;
  danger?: boolean;
  separator?: boolean;
}

export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  const [open, setOpen] = useState(false);
  
  const [dropdownSide, setDropdownSide] = useState<"top" | "bottom">("bottom");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Flip detection: recalculate every time the dropdown opens
  const recalculateSide = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const estimatedListHeight = 290;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    if (spaceBelow < estimatedListHeight && spaceAbove > spaceBelow) {
      setDropdownSide("top");
    } else {
      setDropdownSide("bottom");
    }
  }, []);

  const handleToggle = () => {
    if (!open) recalculateSide();
    setOpen((v) => !v);
  };

  if (!editor) return null;

  const actions: TableAction[] = [
    {
      icon: Rows3,
      label: "Add Row Above",
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: TableRowsSplit,
      label: "Add Row Below",
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: Columns3,
      label: "Add Column Before",
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: TableColumnsSplit,
      label: "Add Column After",
      action: () => editor.chain().focus().addColumnAfter().run(),
      separator: true,
    },
    {
      icon: Trash2,
      label: "Delete Row",
      action: () => editor.chain().focus().deleteRow().run(),
      danger: true,
    },
    {
      icon: Trash2,
      label: "Delete Column",
      action: () => editor.chain().focus().deleteColumn().run(),
      danger: true,
    },
    {
      icon: Trash2,
      label: "Delete Table",
      action: () => editor.chain().focus().deleteTable().run(),
      danger: true,
    },
  ];

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  const listPositionClass =
    dropdownSide === "top"
      ? "bottom-[calc(100%+4px)] top-auto"
      : "top-[calc(100%+4px)] bottom-auto";
  const listMotion =
    dropdownSide === "top"
      ? { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } };

  return (
    <TiptapBubbleMenu
      editor={editor}
      pluginKey="tableBubbleMenu"
      shouldShow={({ editor }) => editor.isActive("table")}
      tippyOptions={{
        duration: 100,
        placement: "top",
        offset: [0, 8],
      }}
      className="bg-transparent border-none shadow-none p-0"
    >
      <div ref={containerRef} className="relative">
        {/* ── Trigger ── */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            ref={triggerRef}
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn(
              "h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg border shadow-lg transition-colors",
              "bg-grey-100 border-grey-200",
              open
                ? "text-accent-500 bg-grey-200"
                : "text-grey-700 hover:text-grey-900 hover:bg-grey-200",
            )}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Table</span>
            <ChevronDown
              className={cn(
                "w-3 h-3 opacity-60 transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </Button>
        </motion.div>

        {/* ── Inline dropdown list ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={listRef}
              {...listMotion}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className={cn(
                "absolute left-0 z-50 min-w-44 rounded-lg border border-grey-200 bg-popover shadow-lg overflow-hidden",
                listPositionClass,
              )}
            >
              {actions.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => handleAction(item.action)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                      item.danger
                        ? item.label === "Delete Table"
                          ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          : "text-grey-600 hover:text-red-500 hover:bg-red-500/10"
                        : "text-grey-700 hover:text-grey-900 hover:bg-grey-100",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        item.danger ? "text-current" : "text-grey-500",
                      )}
                    />
                    {item.label}
                  </button>
                  {item.separator && (
                    <div className="my-1 h-px bg-grey-200 mx-1" />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiptapBubbleMenu>
  );
}
