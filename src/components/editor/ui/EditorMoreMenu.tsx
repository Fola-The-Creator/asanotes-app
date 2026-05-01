import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import {
  MoreHorizontal,
  Undo2,
  Trash2,
  ArchiveRestore,
  Pin,
  PinOff,
  Tag as TagIcon,
  FolderInput,
  FileDown,
  Link2,
  History,
  Archive,
} from "lucide-react";

interface EditorMoreMenuProps {
  isInTrash: boolean;
  isInArchive: boolean;
  isPinned: boolean;
  hasTags: boolean;
  onRestore: () => void;
  onHardDelete: () => void;
  onUnarchive: () => void;
  onTogglePin: () => void;
  onEditTags: () => void;
  onMoveToFolder: () => void;
  onArchive: () => void;
  onMoveToTrash: () => void;
}

export function EditorMoreMenu({
  isInTrash,
  isInArchive,
  isPinned,
  hasTags,
  onRestore,
  onHardDelete,
  onUnarchive,
  onTogglePin,
  onEditTags,
  onMoveToFolder,
  onArchive,
  onMoveToTrash,
}: EditorMoreMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-grey-500 hover:text-grey-900"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      {isInTrash ? (
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={onRestore}>
            <Undo2 className="w-4 h-4 mr-2" />
            Restore note
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onHardDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Permanently delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : isInArchive ? (
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={onUnarchive}>
            <ArchiveRestore className="w-4 h-4 mr-2" />
            Unarchive note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onTogglePin}>
            {isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
            {isPinned ? "Unpin note" : "Pin note"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEditTags}>
            <TagIcon className="w-4 h-4 mr-2" />
            {hasTags ? "Edit tags" : "Add tags"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMoveToFolder}>
            <FolderInput className="w-4 h-4 mr-2" />
            Move to folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onMoveToTrash}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={onTogglePin}>
            {isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
            {isPinned ? "Unpin note" : "Pin note"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEditTags}>
            <TagIcon className="w-4 h-4 mr-2" />
            {hasTags ? "Edit tags" : "Add tags"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMoveToFolder}>
            <FolderInput className="w-4 h-4 mr-2" />
            Move to folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileDown className="w-4 h-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileDown className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link2 className="w-4 h-4 mr-2" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="w-4 h-4 mr-2" />
            View history
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archive note
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onMoveToTrash}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
