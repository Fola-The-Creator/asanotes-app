import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: () => void;
  isActive?: boolean;
  shortcut?: string;
  disabled?: boolean;
}

export function ToolbarBtn({
  icon: Icon,
  label,
  action,
  isActive,
  shortcut,
  disabled,
}: ToolbarButton) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={action}
          disabled={disabled}
          className={cn(
            "w-8 h-8 transition-colors",
            isActive
              ? "bg-grey-200 text-accent-500"
              : "text-grey-600 hover:text-grey-900 hover:bg-grey-100",
            disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          )}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && <span className="ml-2 text-grey-500">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
