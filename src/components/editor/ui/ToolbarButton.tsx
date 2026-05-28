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
            "w-7 h-7 rounded-xs transition-colors",
            isActive
              ? "bg-grey-200/80 text-grey-900"
              : "text-grey-500 hover:text-grey-800 hover:bg-grey-100/80",
            disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && <span className="ml-2 text-grey-500">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
