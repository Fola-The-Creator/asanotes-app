"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Star,
  Archive,
  Trash2,
  Search,
  Plus,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useFolders, useTags, useNotes, useCreateNote } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import Logo from "../icons/Logo";
import { FoldersSection } from "./FoldersSection";
import { TagsSection } from "./TagsSection";
import { ProfileMenu } from "./ProfileMenu";

export function Sidebar() {
  const {
    viewType,
    selectedFolderId,
    sidebarCollapsed,
    setViewType,
    toggleSidebar,
    toggleCommandPalette,
    closeMobileMenu,
  } = useAppStore();

  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();
  const { data: notes = [] } = useNotes();
  const createNoteMut = useCreateNote();

  const navItems = [
    { id: "all", icon: FileText, label: "All Notes" },
    { id: "favorites", icon: Star, label: "Favorites" },
    { id: "archive", icon: Archive, label: "Archive" },
    { id: "trash", icon: Trash2, label: "Trash" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 260 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
          type: "spring",
          damping: 28,
          stiffness: 320,
        }}
        className="flex flex-col h-full bg-grey-50 border-r border-grey-200/60"
      >
        {/* Header */}
        <div
          className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} p-3 border-b border-grey-200/60`}
        >
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Logo className="w-24 fill-grey-900" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop-only collapse toggle */}
          <div className="hidden lg:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSidebar()}
                  className="w-8 h-8 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Close mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            className="lg:hidden w-8 h-8 text-grey-600 hover:text-grey-900 hover:bg-grey-200"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search & New Note */}
        <div className={cn("p-3 space-y-2", sidebarCollapsed && "px-2")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={toggleCommandPalette}
                className={cn(
                  "w-full justify-start text-grey-500 hover:text-grey-900 hover:bg-grey-200",
                  sidebarCollapsed ? "px-2 justify-center" : "px-3",
                )}
              >
                <Search className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="ml-2 text-sm">Search...</span>
                )}
                {!sidebarCollapsed && (
                  <kbd className="ml-auto text-xs bg-grey-200 px-1.5 py-0.5 rounded text-grey-500">
                    Ctrl K
                  </kbd>
                )}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">Search (Ctrl+K)</TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  createNoteMut.mutate({
                    folderId:
                      viewType === "folder" ? selectedFolderId : null,
                  })
                }
                className={cn(
                  "w-full justify-start bg-accent-500 hover:bg-accent-400 text-white font-medium",
                  "transition-[box-shadow,background-color] duration-200",
                  sidebarCollapsed ? "px-2 justify-center" : "px-3",
                )}
              >
                <Plus className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="ml-2">New Note</span>}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right">New Note</TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {navItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewType(item.id as typeof viewType)}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                      viewType === item.id
                        ? "bg-grey-200/80 text-grey-900 shadow-inset"
                        : "text-grey-500 hover:bg-grey-100/70 hover:text-grey-800",
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            ))}

            {/* Folders & Tags */}
            {!sidebarCollapsed && (
              <>
                <FoldersSection folders={folders} notes={notes} />
                <TagsSection tags={tags} notes={notes} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer — Profile menu */}
        <div className="border-t border-grey-200/60 p-2">
          <ProfileMenu collapsed={sidebarCollapsed} />
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
