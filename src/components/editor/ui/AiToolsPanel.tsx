"use client";

import { motion } from "motion/react";
import {
  FileText,
  PenLine,
  Lightbulb,
  CheckCircle,
  Wand2,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const aiTools = [
  {
    icon: FileText,
    label: "Summarize",
    description: "Generate a summary of this note",
    color: "text-blue-500",
  },
  {
    icon: PenLine,
    label: "Rewrite",
    description: "Improve the selected text",
    color: "text-purple-500",
  },
  {
    icon: Lightbulb,
    label: "Ideas",
    description: "Generate related ideas",
    color: "text-yellow-500",
  },
  {
    icon: CheckCircle,
    label: "Fix Grammar",
    description: "Fix grammar and spelling",
    color: "text-green-500",
  },
  {
    icon: Wand2,
    label: "Continue",
    description: "Continue writing from here",
    color: "text-pink-500",
  },
  {
    icon: Languages,
    label: "Translate",
    description: "Translate selected text",
    color: "text-cyan-500",
  },
];

export function AIToolsPanel() {
  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="p-3 border-l border-grey-200 bg-grey-50/50 flex items-center max-h-max w-full overflow-x-auto"
      >
        <div className="space-x-1 flex">
          {aiTools.map((tool) => (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start gap-2 text-grey-600 hover:text-grey-900 hover:bg-grey-100"
                  onClick={() => {
                    // Placeholder — functionality to be implemented per tool
                    console.log(`AI tool: ${tool.label}`);
                  }}
                >
                  <tool.icon className={`w-4 h-4 ${tool.color}`} />
                  <span className="text-sm">{tool.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border border-grey-400">
                <p>{tool.description}</p>
                <p className="text-xs text-grey-500 mt-1">Coming soon</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
