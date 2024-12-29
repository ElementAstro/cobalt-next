import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SideBarToggleProps {
  device: { id: string; name: string; icon: string; active: boolean };
  onToggle: () => void;
}

const getIconComponent = (iconName: string) => {
  // 转换图标名称为pascal case (例如: arrow-left -> ArrowLeft)
  const pascalCase = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (Icons[pascalCase as keyof typeof Icons] ||
    Icons.HelpCircle) as React.FC<{ className?: string }>;
};

export default function SideBarToggle({
  device,
  onToggle,
}: SideBarToggleProps) {
  const Icon = getIconComponent(device.icon.toLowerCase());

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              variant={device.active ? "default" : "secondary"}
              size="icon"
              onClick={onToggle}
              className={`w-12 h-12 relative ${
                device.active ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <Icon className="h-6 w-6" />
              {device.active && (
                <motion.span
                  className="absolute -bottom-1 w-2 h-2 bg-green-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
              <span className="sr-only">{device.name}</span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {device.name}
          </motion.p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
