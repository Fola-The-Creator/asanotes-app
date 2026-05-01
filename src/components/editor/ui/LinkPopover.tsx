"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { type Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "motion/react";
import { Link, CornerDownLeft, ExternalLink, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

interface LinkPopoverProps {
  editor: Editor;
  // Icon size used in the trigger button
  iconSize?: "sm" | "md";
}

interface PanelPos {
  top: number;
  left: number;
}

function calcPos(trigger: HTMLElement): PanelPos {
  const rect = trigger.getBoundingClientRect();
  const panelWidth = 268;
  const left = Math.min(
    rect.right - panelWidth,
    window.innerWidth - panelWidth - 8,
  );
  return {
    top: rect.bottom + 6,
    left: Math.max(8, left),
  };
}

export function LinkPopover({ editor, iconSize = "md" }: LinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [panelPos, setPanelPos] = useState<PanelPos>({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = editor.isActive("link");

  // Sync state from editor when opening
  const syncFromEditor = useCallback(() => {
    const attrs = editor.getAttributes("link");
    setUrl(attrs.href ?? "");
    setOpenInNewTab(attrs.target === "_blank");
  }, [editor]);

  const handleOpen = useCallback(() => {
    syncFromEditor();
    if (triggerRef.current) setPanelPos(calcPos(triggerRef.current));
    setOpen(true);
  }, [syncFromEditor]);

  const handleClose = useCallback(() => setOpen(false), []);

  // Auto-focus input when panel opens
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, handleClose]);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (triggerRef.current) setPanelPos(calcPos(triggerRef.current));
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  // Apply link
  const applyLink = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const href =
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("#")
        ? trimmed
        : `https://${trimmed}`;

    editor
      .chain()
      .focus()
      .setLink({
        href,
        target: openInNewTab ? "_blank" : undefined,
        rel: openInNewTab ? "noopener noreferrer" : undefined,
      })
      .run();
    handleClose();
  }, [url, openInNewTab, editor, handleClose]);

  // Remove link
  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    handleClose();
  }, [editor, handleClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  const iconCls = iconSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnCls = iconSize === "sm" ? "w-7 h-7" : "w-8 h-8";

  // Portal panel
  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
            zIndex: 9999,
          }}
          className="min-w-[268px] rounded-lg border border-grey-200 bg-popover shadow-lg overflow-hidden"
        >
          {/* URL input row */}
          <div className="flex items-center gap-2 px-3 pt-2 pb-1.5">
            <Link className="w-3.5 h-3.5 text-grey-500 shrink-0" />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste a link…"
              spellCheck={false}
              className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-500 outline-none border-none focus:ring-0 min-w-0"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={applyLink}
                  disabled={!url.trim()}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded transition-colors shrink-0",
                    url.trim()
                      ? "text-accent-500 hover:bg-grey-200"
                      : "text-grey-400 cursor-not-allowed",
                  )}
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Apply link (Enter)</TooltipContent>
            </Tooltip>
          </div>

          {/* Separator */}
          <div className="mx-2 h-px bg-grey-200" />

          {/* Remove link */}
          <button
            onClick={removeLink}
            disabled={!isActive}
            className={cn(
              "w-full flex items-center gap-2 px-3 pb-2 pt-0.5 text-sm text-left transition-colors",
              isActive
                ? "text-red-500 hover:bg-red-500/10"
                : "text-grey-400 cursor-not-allowed",
            )}
          >
            <Unlink className="w-3.5 h-3.5 shrink-0" />
            <span>Remove link</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div ref={triggerRef} className="inline-flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={open ? handleClose : handleOpen}
              aria-expanded={open}
              className={cn(
                btnCls,
                "transition-colors",
                open || isActive
                  ? "bg-grey-200 text-accent-500"
                  : "text-grey-600 hover:text-grey-900 hover:bg-grey-100",
              )}
            >
              <Link className={iconCls} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Link</TooltipContent>
        </Tooltip>
      </div>

      {/* Panel rendered in a portal */}
      {typeof document !== "undefined" && createPortal(panel, document.body)}
    </TooltipProvider>
  );
}
