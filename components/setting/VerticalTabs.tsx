import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  tooltip?: string;
}

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function VerticalTabs({
  tabs,
  activeTab,
  setActiveTab,
}: VerticalTabsProps) {
  return (
    <ScrollArea className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-auto">
      <div className="flex flex-col md:flex-col sm:flex-row space-y-2 md:space-y-2 sm:space-y-0 sm:space-x-2">
        {tabs.map((tab) => (
          <TooltipProvider key={tab.value}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.value && (
                    <motion.div
                      className="absolute left-0 md:left-0 sm:left-auto sm:bottom-0 w-1 h-8 bg-primary rounded-r-full sm:w-full sm:h-1"
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              {tab.tooltip && (
                <TooltipContent className="sm:hidden">
                  <p>{tab.tooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </ScrollArea>
  );
}
