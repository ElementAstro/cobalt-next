import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  usageCount: number;
  category: string;
  CustomComponent?: React.ComponentType; // 确保类型为组件类型
}

export interface CategorySectionProps {
  category: string;
  tools: Tool[];
  onSelectTool: (id: string) => void;
}

export interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  usageCount: number;
  category: string;
  onSelect: (id: string) => void;
  CustomComponent?: React.ComponentType;
}

export interface ToolDetailProps {
  id: string;
  name: string;
  icon: LucideIcon;
  onBack: () => void;
  onUse: (id: string) => void;
  CustomComponent?: React.ComponentType;
}
