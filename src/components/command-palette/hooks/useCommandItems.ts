import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
import { useNotes, useCreateNote } from "@/hooks/useNotes";
import {
  FileText,
  Folder,
  Tag,
  Plus,
  Star,
  Archive,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

export interface CommandItem {
  id: string;
  type: "note" | "folder" | "tag" | "action";
  icon: React.ElementType;
  label: string;
  description?: string;
  action: () => void;
}

export function useCommandItems() {
  const {
    commandPaletteOpen,
    viewType,
    selectedFolderId,
    toggleCommandPalette,
    setSelectedNote,
    setSelectedFolder,
    setSelectedTag,
    setViewType,
  } = useAppStore();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  

  const { data: notes = [] } = useNotes();
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();
  const createNoteMut = useCreateNote();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Actions
    items.push({
      id: "new-note",
      type: "action",
      icon: Plus,
      label: "New Note",
      description: "Create a new note",
      action: () => {
        createNoteMut.mutate({
          folderId: viewType === "folder" ? selectedFolderId : null,
        });
        toggleCommandPalette();
      },
    });

    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    const ThemeIcon = theme === "light" ? Moon : theme === "dark" ? Monitor : Sun;
    const themeLabel = theme === "light" ? "Switch to Dark Mode" : theme === "dark" ? "Switch to System Theme" : "Switch to Light Mode";

    items.push({
      id: "toggle-theme",
      type: "action",
      icon: ThemeIcon,
      label: themeLabel,
      action: () => {
        setTheme(nextTheme);
      },
    });

    items.push({
      id: "view-favorites",
      type: "action",
      icon: Star,
      label: "View Favorites",
      action: () => {
        setViewType("favorites");
        toggleCommandPalette();
      },
    });

    items.push({
      id: "view-archive",
      type: "action",
      icon: Archive,
      label: "View Archive",
      action: () => {
        setViewType("archive");
        toggleCommandPalette();
      },
    });

    items.push({
      id: "view-all-notes",
      type: "action",
      icon: FileText,
      label: "View All Notes",
      action: () => {
        setViewType("all");
        toggleCommandPalette();
      },
    });

    // Notes
    const recentNotes = [...notes]
      .filter((n) => !n.isDeleted && !n.isArchived)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 10);

    recentNotes.forEach((note) => {
      items.push({
        id: note.id,
        type: "note",
        icon: FileText,
        label: note.title || "Untitled",
        description: note.preview.slice(0, 60),
        action: () => {
          setSelectedNote(note.id);
          setViewType("all");
          toggleCommandPalette();
        },
      });
    });

    // Folders
    folders.forEach((folder) => {
      const count = notes.filter(
        (n) => n.folderId === folder.id && !n.isArchived && !n.isDeleted,
      ).length;
      items.push({
        id: folder.id,
        type: "folder",
        icon: Folder,
        label: folder.name,
        description: `${count} ${count === 1 ? "note" : "notes"}`,
        action: () => {
          setSelectedFolder(folder.id);
          toggleCommandPalette();
        },
      });
    });

    // Tags
    tags.forEach((tag) => {
      const count = notes.filter(
        (n) => n.tags.includes(tag.id) && !n.isArchived && !n.isDeleted,
      ).length;
      items.push({
        id: tag.id,
        type: "tag",
        icon: Tag,
        label: `#${tag.name}`,
        description: `${count} ${count === 1 ? "note" : "notes"}`,
        action: () => {
          setSelectedTag(tag.id);
          toggleCommandPalette();
        },
      });
    });

    return items;
  }, [
    notes,
    folders,
    tags,
    theme,
    viewType,
    selectedFolderId,
    createNoteMut,
    setTheme,
    toggleCommandPalette,
    setSelectedNote,
    setSelectedFolder,
    setSelectedTag,
    setViewType,
  ]);

  const filteredItems = useMemo(() => {
    if (!query) return commandItems;
    const lowerQuery = query.toLowerCase();
    return commandItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery),
    );
  }, [commandItems, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          toggleCommandPalette();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (i) => (i - 1 + filteredItems.length) % filteredItems.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          toggleCommandPalette();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, filteredItems, selectedIndex, toggleCommandPalette]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      action: [],
      note: [],
      folder: [],
      tag: [],
    };
    filteredItems.forEach((item) => {
      groups[item.type].push(item);
    });
    return groups;
  }, [filteredItems]);

  return {
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    groupedItems,
    commandPaletteOpen,
    toggleCommandPalette,
  };
}
