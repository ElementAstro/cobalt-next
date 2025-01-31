"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  route: string;
  active: boolean;
}

interface SidebarProps {
  devices: SidebarItem[];
  onToggle: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0, x: -50, width: 0 },
  visible: {
    opacity: 1,
    x: 0,
    width: "4rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const scrollVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

const getIconComponent = (iconName: string) => {
  const pascalCase = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (Icons[pascalCase as keyof typeof Icons] ||
    Icons.HelpCircle) as React.FC<{ className?: string }>;
};

export default function Sidebar({ devices, onToggle }: SidebarProps) {
  const router = useRouter();

  return (
    <TooltipProvider>
      <motion.div
        className="w-12 md:w-14 p-1.5 border-r border-gray-700/50 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-start gap-2 h-[calc(100vh-3rem)] sticky top-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex-1 w-full overflow-y-auto scrollbar-none"
          variants={scrollVariants}
        >
          {devices.map((device) => {
            const DeviceIcon = getIconComponent(device.icon);
            return (
              <motion.div key={device.id} className="mb-1.5" variants={itemVariants}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={device.active ? "default" : "ghost"}
                        size="icon"
                        onClick={() => {
                          onToggle(device.id);
                          router.push(device.route);
                        }}
                        className={`w-9 h-9 relative ${
                          device.active ? "bg-primary/20" : ""
                        }`}
                      >
                        <DeviceIcon className="h-6 w-6" />
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
                      className="text-sm"
                    >
                      {device.name}
                    </motion.p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}