"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  PenLine,
  Lightbulb,
  CheckCircle,
  Wand2,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";

const aiTools = [
  {
    icon: FileText,
    label: "Summarize",
    description: "Generate a summary",
    color: "text-blue-400",
    bgClass: "bg-blue-500/10",
  },
  {
    icon: PenLine,
    label: "Rewrite",
    description: "Improve selected text",
    color: "text-purple-400",
    bgClass: "bg-purple-500/10",
  },
  {
    icon: Lightbulb,
    label: "Ideas",
    description: "Generate related ideas",
    color: "text-amber-400",
    bgClass: "bg-amber-500/10",
  },
  {
    icon: CheckCircle,
    label: "Fix Grammar",
    description: "Fix grammar & spelling",
    color: "text-green-400",
    bgClass: "bg-green-500/10",
  },
  {
    icon: Wand2,
    label: "Continue",
    description: "Continue writing",
    color: "text-pink-400",
    bgClass: "bg-pink-500/10",
  },
  {
    icon: Languages,
    label: "Translate",
    description: "Translate selection",
    color: "text-cyan-400",
    bgClass: "bg-cyan-500/10",
  },
];

export function AIToolsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "absolute top-8 right-4 z-10",
          "w-8 h-8 rounded-md flex items-center justify-center",
          "transition-all duration-200",
          open
            ? "bg-accent-500/15 text-accent-500 shadow-[0_0_0_1px_rgba(232,106,74,0.3)]"
            : "bg-grey-100/60 text-grey-400 hover:bg-grey-100 hover:text-grey-700",
        )}
        aria-label={open ? "Close AI tools" : "Open AI tools"}
      >
        <Wand2 className="w-3.5 h-3.5" />
      </motion.button>

      {/* Floating panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.96 }}
            transition={{ type: "spring", damping: 30, stiffness: 380 }}
            className="absolute top-17 right-3 z-10 w-[216px] glass backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border-0"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-glass-border">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-grey-600">
                AI Tools
              </span>
              <span className="text-[10px] text-grey-400 bg-grey-200/60 px-1.5 py-0.5 rounded-full font-medium">
                Soon
              </span>
            </div>

            {/* Tool list */}
            <div className="p-1.5 space-y-0.5">
              {aiTools.map((tool, i) => (
                <motion.button
                  key={tool.label}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.04,
                    type: "spring",
                    damping: 30,
                    stiffness: 400,
                  }}
                  disabled
                  onClick={() => console.log(`AI: ${tool.label}`)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md",
                    "text-left transition-colors duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:bg-grey-100/80",
                  )}
                >
                  {/* Icon badge */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0",
                      tool.bgClass,
                    )}
                  >
                    <tool.icon className={cn("w-3.5 h-3.5", tool.color)} />
                  </div>

                  {/* Labels */}
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-grey-700 leading-none mb-[3px]">
                      {tool.label}
                    </p>
                    <p className="text-[10px] text-grey-400 leading-none truncate">
                      {tool.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
