"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "@/store/useAppStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Button } from "@/components/ui/Button";
import { SettingsNav, type SettingsTab } from "./SettingsNav";
import { AppearanceSection } from "./sections/AppearanceSection";
import { EditorSection } from "./sections/EditorSection";
import { BehaviorSection } from "./sections/BehaviorSection";
import { NotesSection } from "./sections/NotesSection";
import { AccountSection } from "./sections/AccountSection";

const SECTION_MAP: Record<SettingsTab, React.ReactNode> = {
  appearance: <AppearanceSection />,
  editor: <EditorSection />,
  behavior: <BehaviorSection />,
  notes: <NotesSection />,
  account: <AccountSection />,
};

const SECTION_TITLES: Record<SettingsTab, string> = {
  appearance: "Appearance",
  editor: "Editor",
  behavior: "Behavior",
  notes: "Notes",
  account: "Account",
};

export function SettingsModal() {
  const { settingsOpen, closeSettings } = useAppStore();
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  return (
    <DialogPrimitive.Root open={settingsOpen} onOpenChange={(open) => !open && closeSettings()}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Modal Content */}
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={closeSettings}
          className="settings-modal fixed z-50 bg-background border border-grey-200 shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-label="Settings"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-grey-200 shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent-500" />
              <DialogPrimitive.Title className="text-base font-semibold text-grey-900">
                Settings
              </DialogPrimitive.Title>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset — desktop only */}
              <button
                onClick={() => {
                  if (window.confirm("Reset all settings to defaults?")) {
                    resetSettings();
                  }
                }}
                className="hidden sm:flex text-xs text-grey-400 hover:text-grey-600 px-2 py-1 rounded-md hover:bg-grey-100 transition-colors"
                aria-label="Reset settings to defaults"
              >
                Reset
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeSettings}
                className="w-7 h-7 text-grey-500 hover:text-grey-900 hover:bg-grey-200 shrink-0"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile: horizontal tab bar */}
          <div className="sm:hidden border-b border-grey-200 px-3 py-2 shrink-0 bg-grey-50">
            <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} horizontal />
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Desktop: left sidebar nav */}
            <aside className="hidden sm:flex flex-col w-44 shrink-0 border-r border-grey-200 bg-grey-50 overflow-y-auto">
              <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
            </aside>

            {/* Content panel */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Section label — desktop only */}
              <div className="hidden sm:flex items-center px-5 py-3 border-b border-grey-100 shrink-0">
                <p className="text-xs font-semibold text-grey-500 uppercase tracking-wider">
                  {SECTION_TITLES[activeTab]}
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    >
                      {SECTION_MAP[activeTab]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Mobile footer */}
          <div className="sm:hidden border-t border-grey-200 px-5 py-4 shrink-0 bg-background">
            <Button
              variant="ghost"
              onClick={closeSettings}
              className="w-full text-grey-600 hover:bg-grey-100"
            >
              Done
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
