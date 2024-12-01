import { motion } from "framer-motion";
import DeviceToggle from "./DeviceToggle";

interface SidebarProps {
  devices: Array<{
    id: string;
    name: string;
    icon: string;
    active: boolean;
  }>;
  onToggle: (id: string) => void;
}

export function Sidebar({ devices, onToggle }: SidebarProps) {
  return (
    <motion.div
      className="w-16 p-2 border-r border-gray-700 flex flex-col items-center justify-start space-y-4 bg-gray-800 text-white overflow-y-hidden max-h-screen"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        {devices.map((device) => (
          <DeviceToggle
            key={device.id}
            device={device}
            onToggle={() => onToggle(device.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
