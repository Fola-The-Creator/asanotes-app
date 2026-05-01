"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { type Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "motion/react";
import { Image, Link2, Upload, CornerDownLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

type Tab = "url" | "upload";

interface ImagePopoverProps {
  editor: Editor;
}

interface PanelPos {
  top: number;
  left: number;
}

function calcPos(trigger: HTMLElement): PanelPos {
  const rect = trigger.getBoundingClientRect();
  const panelWidth = 288; // w-[288px]
  const left = Math.min(
    rect.right - panelWidth,
    window.innerWidth - panelWidth - 8,
  );
  return {
    top: rect.bottom + 6,
    left: Math.max(8, left),
  };
}

export function ImagePopover({ editor }: ImagePopoverProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [panelPos, setPanelPos] = useState<PanelPos>({ top: 0, left: 0 });

  const triggerRef   = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setUrl("");
    setUploadError(null);
    setTab("url");
  }, []);

  // Auto-focus URL input on open
  useEffect(() => {
    if (open && tab === "url") {
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open, tab]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inPanel   = panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, handleClose]);

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

  // Insert image into editor
  const insertImage = useCallback(
    (src: string) => {
      editor.chain().focus().setImage({ src }).run();
      handleClose();
    },
    [editor, handleClose],
  );

  // URL tab
  const applyUrl = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const href =
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:")
        ? trimmed
        : `https://${trimmed}`;
    insertImage(href);
  }, [url, insertImage]);

  // Upload tab
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.");
        return;
      }

      setUploading(true);
      setUploadError(null);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploading(false);
        insertImage(dataUrl);
      };
      reader.onerror = () => {
        setUploadError("Failed to read file. Please try again.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [insertImage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); applyUrl(); }
    if (e.key === "Escape") { e.preventDefault(); handleClose(); }
  };

  const handleTriggerClick = () => {
    if (open) {
      handleClose();
    } else {
      if (triggerRef.current) setPanelPos(calcPos(triggerRef.current));
      setOpen(true);
    }
  };

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
            width: 288,
          }}
          className="rounded-lg border border-grey-200 bg-popover shadow-lg overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex items-center border-b border-grey-200">
            <button
              onClick={() => setTab("url")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
                tab === "url"
                  ? "text-accent-500 border-b-2 border-accent-500 -mb-px"
                  : "text-grey-500 hover:text-grey-700",
              )}
            >
              <Link2 className="w-3.5 h-3.5" />
              URL
            </button>
            <button
              onClick={() => setTab("upload")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
                tab === "upload"
                  ? "text-accent-500 border-b-2 border-accent-500 -mb-px"
                  : "text-grey-500 hover:text-grey-700",
              )}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          </div>

          {/* Tab content */}
          <div className="p-2">
            {tab === "url" && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-grey-100 border border-grey-200">
                  <Image className="w-3.5 h-3.5 text-grey-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste image URL…"
                    spellCheck={false}
                    className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-500 outline-none border-none focus:ring-0 min-w-0"
                  />
                  {url && (
                    <button
                      onClick={() => setUrl("")}
                      className="text-grey-400 hover:text-grey-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={applyUrl}
                  disabled={!url.trim()}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                    url.trim()
                      ? "bg-accent-500 text-white hover:bg-accent-400"
                      : "bg-grey-200 text-grey-400 cursor-not-allowed",
                  )}
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  Insert image
                </button>
              </div>
            )}

            {tab === "upload" && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={cn(
                    "w-full flex flex-col items-center justify-center gap-2 py-6 rounded-md border-2 border-dashed transition-colors",
                    uploading
                      ? "border-grey-300 text-grey-400 cursor-wait"
                      : "border-grey-300 text-grey-500 hover:border-accent-500 hover:text-accent-500 cursor-pointer",
                  )}
                >
                  {uploading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin text-accent-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                        />
                      </svg>
                      <span className="text-xs">Inserting…</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <div className="text-center">
                        <p className="text-xs font-medium">Click to upload</p>
                        <p className="text-[11px] text-grey-400 mt-0.5">
                          PNG, JPG, GIF, WebP…
                        </p>
                      </div>
                    </>
                  )}
                </button>

                {uploadError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 text-center"
                  >
                    {uploadError}
                  </motion.p>
                )}
              </div>
            )}
          </div>
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
              onClick={handleTriggerClick}
              aria-expanded={open}
              className={cn(
                "w-8 h-8 transition-colors",
                open
                  ? "bg-grey-200 text-accent-500"
                  : "text-grey-600 hover:text-grey-900 hover:bg-grey-100",
              )}
            >
              <Image className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Image</TooltipContent>
        </Tooltip>
      </div>

      {/* Panel rendered in a portal */}
      {typeof document !== "undefined" && createPortal(panel, document.body)}
    </TooltipProvider>
  );
}
