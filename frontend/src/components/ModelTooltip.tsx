
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ModelTooltipProps {
  content: string
}

export function ModelTooltip({ content }: ModelTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-help ml-2" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
