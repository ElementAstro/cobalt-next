"use client";

import { useState } from "react";
import { Pin, PinOff, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface App {
  id: string;
  name: string;
  icon: string;
  isPinned: boolean;
  category: string;
}

interface AppIconProps {
  id: string;
  name: string;
  icon: string;
  isPinned: boolean;
  onPin: () => void;
  onLaunch: (app: App) => void;
  onDelete: () => void;
  onEdit: (newName: string) => void;
  className?: string;
  view: "grid" | "list";
  category: string;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function AppIcon({
  id,
  name,
  icon,
  isPinned,
  onPin,
  onLaunch,
  onDelete,
  onEdit,
  className,
  view,
  category,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
}: AppIconProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedName);
    setIsEditing(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {isSelectionMode && (
                <div
                  className="absolute -right-2 -top-2 z-10 rounded-full bg-background border-2 border-border p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(id);
                  }}
                >
                  <Checkbox checked={isSelected} />
                </div>
              )}
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-auto flex items-center gap-2 p-2 rounded-lg hover:bg-accent group transition-all duration-200",
                  view === "grid" ? "flex-col" : "flex-row justify-start",
                  className
                )}
                onClick={() => onLaunch({ id, name, icon, isPinned, category })}
              >
                <motion.div
                  className={cn(
                    "relative",
                    view === "grid" ? "w-12 h-12" : "w-8 h-8"
                  )}
                  whileHover={{ rotate: 5 }}
                >
                  <Image
                    src={icon}
                    alt={name}
                    fill
                    className="object-contain"
                  />
                  {isPinned && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Pin className="absolute -top-1 -right-1 w-3 h-3 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
                {isEditing ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleSave}
                    autoFocus
                    className="text-sm text-center w-full"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm",
                      view === "grid"
                        ? "text-center line-clamp-2"
                        : "text-left truncate"
                    )}
                  >
                    {name}
                  </span>
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => onLaunch({ id, name, icon, isPinned, category })}
        >
          打开
        </ContextMenuItem>
        <ContextMenuItem onClick={onPin}>
          {isPinned ? "取消固定" : "固定到开始"}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleEdit}>
          <Edit2 className="mr-2 h-4 w-4" />
          重命名
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
