import { type Editor } from "@tiptap/react";
import { List, ListOrdered, CheckSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

export function ListsDropdown({ editor }: { editor: Editor }) {
  const listTypes = [
    {
      key: "bulletList",
      icon: List,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: "orderedList",
      icon: ListOrdered,
      label: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      key: "taskList",
      icon: CheckSquare,
      label: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
    },
  ];

  const activeType = listTypes.find((t) => editor.isActive(t.key));
  const TriggerIcon = activeType ? activeType.icon : List;
  const isAnyActive = !!activeType;

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
          <TooltipContent>Lists</TooltipContent>
          <DropdownMenuContent align="start" className="min-w-36">
            {listTypes.map(({ key, icon: Icon, label, action }) => (
              <DropdownMenuItem
                key={key}
                onClick={action}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  editor.isActive(key) && "text-accent-500 bg-grey-100",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
