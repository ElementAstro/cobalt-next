import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface IconData {
  icon: React.ElementType;
  label?: string;
  disabled?: boolean;
  tooltip?: string;
}

interface IconGroup {
  name: string;
  icons: IconData[];
}

interface IconGroupProps {
  icons: IconGroup[];
  layout?: "grid" | "compact";
  columns?: 2 | 3 | 4;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  inactiveColor?: string;
  onIconClick?: (groupIndex: number, iconIndex: number) => void;
  animationType?: "fade" | "scale" | "rotate";
  multiSelect?: boolean;
  showSearch?: boolean;
}

export function IconGroup({
  icons,
  layout = "grid",
  columns = 2,
  showLabels = true,
  size = "md",
  activeColor = "bg-primary text-primary-foreground",
  inactiveColor = "bg-background text-foreground",
  onIconClick,
  animationType = "scale",
  multiSelect = false,
  showSearch = false,
}: IconGroupProps) {
  const [activeStates, setActiveStates] = useState<boolean[][]>([]);
  const [expandedGroups, setExpandedGroups] = useState<boolean[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setActiveStates(
      icons.map((group) => new Array(group.icons.length).fill(false))
    );
    setExpandedGroups(new Array(icons.length).fill(true));
  }, [icons]);

  const toggleActive = (groupIndex: number, iconIndex: number) => {
    setActiveStates((prev) => {
      const newStates = [...prev];
      if (multiSelect) {
        newStates[groupIndex][iconIndex] = !newStates[groupIndex][iconIndex];
      } else {
        newStates[groupIndex] = newStates[groupIndex].map(
          (_, i) => i === iconIndex
        );
      }
      return newStates;
    });
    onIconClick && onIconClick(groupIndex, iconIndex);
  };

  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups((prev) => {
      const newStates = [...prev];
      newStates[groupIndex] = !newStates[groupIndex];
      return newStates;
    });
  };

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  const layoutClasses =
    layout === "compact" ? "flex flex-wrap" : `grid grid-cols-${columns}`;

  const getAnimationVariants = (isActive: boolean) => {
    switch (animationType) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "scale":
        return {
          initial: { scale: 0.8 },
          animate: { scale: 1 },
          exit: { scale: 0.8 },
        };
      case "rotate":
        return {
          initial: { rotate: -180 },
          animate: { rotate: 0 },
          exit: { rotate: 180 },
        };
      default:
        return {
          initial: {},
          animate: {},
          exit: {},
        };
    }
  };

  const filteredIcons = icons
    .map((group) => ({
      ...group,
      icons: group.icons.filter(
        (icon) =>
          icon.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.tooltip?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.icons.length > 0);

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}
      {filteredIcons.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <button
            onClick={() => toggleGroup(groupIndex)}
            className="flex items-center text-lg font-semibold"
          >
            {expandedGroups[groupIndex] ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            {group.name}
          </button>
          {expandedGroups[groupIndex] && (
            <motion.div
              className={cn(layoutClasses, "gap-2 max-w-fit")}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence>
                {group.icons.map((icon, iconIndex) => (
                  <motion.div
                    key={iconIndex}
                    variants={getAnimationVariants(
                      activeStates[groupIndex]?.[iconIndex]
                    )}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              sizeClasses[size],
                              "flex flex-col items-center justify-center p-2 transition-colors duration-300",
                              activeStates[groupIndex]?.[iconIndex]
                                ? activeColor
                                : inactiveColor,
                              layout === "compact" && "m-1",
                              icon.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() =>
                              !icon.disabled &&
                              toggleActive(groupIndex, iconIndex)
                            }
                            disabled={icon.disabled}
                          >
                            {icon.icon && (
                              <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <icon.icon
                                  className={cn(
                                    "mb-1",
                                    size === "sm"
                                      ? "h-4 w-4"
                                      : size === "md"
                                      ? "h-5 w-5"
                                      : "h-6 w-6"
                                  )}
                                />
                              </motion.div>
                            )}
                            {showLabels && icon.label && (
                              <motion.span
                                className={cn(
                                  "text-xs",
                                  size === "sm" && "text-[10px]"
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                {icon.label}
                              </motion.span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        {icon.tooltip && (
                          <TooltipContent>
                            <p>{icon.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
