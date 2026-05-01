import { type Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3, ChevronDown, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

export function HeadingsDropdown({ editor }: { editor: Editor }) {
  const levels = [
    { level: 1 as const, icon: Heading1, label: "Heading 1", shortcut: "Ctrl+Alt+1" },
    { level: 2 as const, icon: Heading2, label: "Heading 2", shortcut: "Ctrl+Alt+2" },
    { level: 3 as const, icon: Heading3, label: "Heading 3", shortcut: "Ctrl+Alt+3" },
  ];

  const activeLevel = levels.find((l) =>
    editor.isActive("heading", { level: l.level }),
  );
  const TriggerIcon = activeLevel ? activeLevel.icon : Type;
  const isAnyActive = !!activeLevel;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-auto px-2 h-8 gap-0.5 transition-colors",
                  isAnyActive
                    ? "bg-grey-200 text-accent-500"
                    : "text-grey-600 hover:text-grey-900 hover:bg-grey-100",
                )}
              >
                <TriggerIcon className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Headings</TooltipContent>
          <DropdownMenuContent align="start" className="min-w-36">
            {levels.map(({ level, icon: Icon, label, shortcut }) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  editor.isActive("heading", { level }) &&
                    "text-accent-500 bg-grey-100",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{label}</span>
                <span className="text-xs text-grey-500">{shortcut}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
