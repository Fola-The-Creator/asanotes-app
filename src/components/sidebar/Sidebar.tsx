"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Star,
  Archive,
  Trash2,
  Search,
  Plus,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Moon,
  Sun,
  Monitor,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
import { useNotes } from "@/hooks/useNotes";
import { useCreateNote } from "@/hooks/useNotes";
import { useUser } from "@/hooks/useUser";
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

export function Sidebar() {
  const {
    viewType,
    selectedFolderId,
    sidebarCollapsed,
    setViewType,
    toggleSidebar,
    toggleCommandPalette,
    closeMobileMenu,
    openSettings,
  } = useAppStore();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="w-4 h-4" />;
    if (theme === "light") return <Moon className="w-4 h-4" />;
    if (theme === "dark") return <Monitor className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return "Dark mode";
    if (theme === "light") return "Dark mode";
    if (theme === "dark") return "System theme";
    return "Light mode";
  };

  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();
  const { data: notes = [] } = useNotes();
  const { data: user } = useUser();
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
        className="flex flex-col h-full bg-grey-50 border-r border-grey-200"
      >
        {/* Header */}
        <div
          className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} p-3 border-b border-grey-200`}
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
                  "w-full justify-start bg-accent-500 hover:bg-accent-600 text-white",
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
            {/* Nav items */}
            {navItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewType(item.id as typeof viewType)}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      viewType === item.id
                        ? "bg-grey-200 text-grey-900"
                        : "text-grey-600 hover:bg-grey-100 hover:text-grey-900",
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

        {/* Footer */}
        <div className="border-t border-grey-200 p-3">
          <div
            className={cn(
              "flex flex-col items-center gap-1",
              sidebarCollapsed && "flex-col",
            )}
          >
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(nextTheme)}
                  className="w-full justify-start p-3 font-normal text-grey-600 hover:text-grey-900 hover:bg-grey-200"
                >
                  {getThemeIcon()}
                  {!sidebarCollapsed && (
                    <span>{getThemeLabel()}</span>
                  )}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  {getThemeLabel()}
                </TooltipContent>
              )}
            </Tooltip>

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openSettings}
                  className="w-full justify-start p-3 font-normal text-grey-600 hover:text-grey-900 hover:bg-grey-200"
                >
                  <Settings className="w-4 h-4" />
                  {!sidebarCollapsed && <span>Settings</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">Settings</TooltipContent>
              )}
            </Tooltip>

            {/* Account */}
            <div
              className={`${sidebarCollapsed && "py-3! p-0! justify-center"} p-3 w-full flex-1 flex items-center gap-2 min-w-0`}
            >
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full shrink-0 bg-grey-200 flex items-center justify-center text-xs font-medium text-grey-500">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-grey-900 truncate">
                    {user?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-grey-500 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
