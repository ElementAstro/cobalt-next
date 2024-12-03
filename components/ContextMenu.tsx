"use client";

import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type MenuItemType =
  | "item"
  | "checkbox"
  | "radio"
  | "separator"
  | "submenu"
  | "label";

interface BaseMenuItem {
  id: string;
  type: MenuItemType;
  label?: string;
  icon?: LucideIcon;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface StandardMenuItem extends BaseMenuItem {
  type: "item";
}

interface CheckboxMenuItem extends BaseMenuItem {
  type: "checkbox";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

interface RadioMenuItem extends BaseMenuItem {
  type: "radio";
  value: string;
}

interface RadioGroupMenuItem extends BaseMenuItem {
  type: "submenu";
  items: RadioMenuItem[];
  value: string;
  onValueChange: (value: string) => void;
}

interface SubmenuItem extends BaseMenuItem {
  type: "submenu";
  items: MenuItem[];
}

interface SeparatorMenuItem extends BaseMenuItem {
  type: "separator";
}

interface LabelMenuItem extends BaseMenuItem {
  type: "label";
}

type MenuItem =
  | StandardMenuItem
  | CheckboxMenuItem
  | RadioMenuItem
  | RadioGroupMenuItem
  | SubmenuItem
  | SeparatorMenuItem
  | LabelMenuItem;

interface CustomContextMenuProps {
  children: React.ReactNode;
  items: MenuItem[];
  className?: string;
  contentClassName?: string;
}

const renderMenuItem = (item: MenuItem) => {
  switch (item.type) {
    case "item":
      return (
        <ContextMenuItem
          key={item.id}
          disabled={item.disabled}
          onClick={item.onClick}
          className="flex items-center"
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
          {item.shortcut && (
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          )}
        </ContextMenuItem>
      );
    case "checkbox":
      return (
        <ContextMenuCheckboxItem
          key={item.id}
          checked={item.checked}
          disabled={item.disabled}
          onCheckedChange={item.onCheckedChange}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
          {item.shortcut && (
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          )}
        </ContextMenuCheckboxItem>
      );
    case "radio":
      return (
        <ContextMenuRadioItem
          key={item.id}
          value={item.value}
          disabled={item.disabled}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
          {item.shortcut && (
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          )}
        </ContextMenuRadioItem>
      );
    case "submenu":
      if ("value" in item && "onValueChange" in item) {
        return (
          <ContextMenuSub key={item.id}>
            <ContextMenuSubTrigger disabled={item.disabled}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup
                value={item.value}
                onValueChange={item.onValueChange}
              >
                {item.items.map(renderMenuItem)}
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      } else {
        return (
          <ContextMenuSub key={item.id}>
            <ContextMenuSubTrigger disabled={item.disabled}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.label}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {item.items.map(renderMenuItem)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      }
    case "separator":
      return <ContextMenuSeparator key={item.id} />;
    case "label":
      return (
        <ContextMenuLabel key={item.id}>
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
        </ContextMenuLabel>
      );
    default:
      return null;
  }
};

export function CustomContextMenu({
  children,
  items,
  className,
  contentClassName,
}: CustomContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className={`bg-gray-800 text-white rounded-md shadow-lg p-2 ${contentClassName}`}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {renderMenuItem(item)}
          </motion.div>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
