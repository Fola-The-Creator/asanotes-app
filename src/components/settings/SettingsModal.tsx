"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "@/store/useAppStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useIsMobile } from "@/hooks";
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

/** Inner content — shared between mobile Drawer and desktop Dialog */
function SettingsContent({
  activeTab,
  setActiveTab,
  onClose,
  onReset,
}: {
  activeTab: SettingsTab;
  setActiveTab: (t: SettingsTab) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-grey-200/60 shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent-500" />
          <span className="text-[15px] font-semibold text-grey-900">Settings</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="hidden sm:flex text-[12px] text-grey-400 hover:text-grey-600 px-2 py-1 rounded-md hover:bg-grey-100 transition-colors"
          >
            Reset
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-7 h-7 text-grey-500 hover:text-grey-900 hover:bg-grey-200 rounded-sm shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile: horizontal tab bar */}
      <div className="sm:hidden border-b border-grey-200/60 px-3 py-2 shrink-0 bg-grey-50/50">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} horizontal />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Desktop: left sidebar nav */}
        <aside className="hidden sm:flex flex-col w-44 shrink-0 border-r border-grey-200/60 bg-grey-50/50 overflow-y-auto">
          <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* <div className="hidden sm:flex items-center px-5 py-3 border-b border-grey-100/60 shrink-0">
            <p className="text-[10px] font-semibold text-grey-400 uppercase tracking-[0.08em]">
              {SECTION_TITLES[activeTab]}
            </p>
          </div> */}
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
      <div className="sm:hidden border-t border-grey-200/60 px-5 py-4 shrink-0">
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full text-grey-600 hover:bg-grey-100 rounded-md font-medium"
        >
          Done
        </Button>
      </div>
    </>
  );
}

export function SettingsModal() {
  const { settingsOpen, closeSettings } = useAppStore();
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  const handleReset = () => {
    if (window.confirm("Reset all settings to defaults?")) {
      resetSettings();
    }
  };

  /* ── Mobile: vaul bottom drawer ─────────────────────────── */
  if (isMobile) {
    return (
      <Drawer.Root
        open={settingsOpen}
        onOpenChange={(open) => !open && closeSettings()}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 outline-none flex flex-col glass-heavy rounded-xl rounded-b-none max-h-[90svh]">
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-grey-300/50 mx-auto mt-3 mb-0.5 shrink-0" />
            <SettingsContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={closeSettings}
              onReset={handleReset}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  /* ── Desktop: Radix dialog ───────────────────────────────── */
  return (
    <DialogPrimitive.Root
      open={settingsOpen}
      onOpenChange={(open) => !open && closeSettings()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={closeSettings}
          aria-label="Settings"
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col bg-background border border-grey-200/60 shadow-float rounded-xl overflow-hidden"
          style={{ width: "min(680px, calc(100vw - 2rem))", height: "min(560px, 90svh)" }}
        >
          <SettingsContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={closeSettings}
            onReset={handleReset}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
