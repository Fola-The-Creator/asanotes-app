"use client";

import { motion } from "motion/react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/editor/NoteEditor";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { useAppStore } from "@/store/useAppStore";
import { useNotes, useSelectedNote } from "@/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, mobileView } = useAppStore();
  const { data: notes = [] } = useNotes();
  const selectedNote = useSelectedNote(notes);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-grey-0">
      {/* Mobile Header — hidden on desktop */}
      <MobileHeader
        title={mobileView === "editor" ? selectedNote?.title : undefined}
      />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — hidden on mobile */}
        <div className="hidden lg:flex h-full">
          <Sidebar />
        </div>

        {/* Desktop: Notes List */}
        <motion.div
          initial={false}
          animate={{ width: sidebarCollapsed ? 400 : 350 }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
          className="hidden lg:flex h-full shrink-0"
        >
          <NotesList />
        </motion.div>

        {/* Desktop: Editor Area */}
        <div className="hidden lg:flex flex-1 h-full overflow-hidden">
          <NoteEditor />
        </div>

        {/* Mobile: Single-view animated panel */}
        <div className="lg:hidden flex-1 overflow-hidden relative">
          {mobileView === "list" ? (
            <motion.div
              key="mobile-list"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 35, stiffness: 380 }}
              className="absolute inset-0 pb-[72px]"
            >
              <NotesList />
            </motion.div>
          ) : (
            <motion.div
              key="mobile-editor"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 35, stiffness: 380 }}
              className="absolute inset-0"
            >
              <NoteEditor />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Command Palette */}
      <CommandPalette />

      {/* Settings Modal */}
      <SettingsModal />

      <div className="hidden">{children}</div>
    </div>
  );
}
