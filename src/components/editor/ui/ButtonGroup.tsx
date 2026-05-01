import { TooltipProvider } from "@/components/ui/Tooltip";
import { ToolbarBtn, type ToolbarButton } from "./ToolbarButton";

export function ButtonGroup({ buttons }: { buttons: ToolbarButton[] }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-0.5">
        {buttons.map((btn) => (
          <ToolbarBtn key={btn.label} {...btn} />
        ))}
      </div>
    </TooltipProvider>
  );
}
