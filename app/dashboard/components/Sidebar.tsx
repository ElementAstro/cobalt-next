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

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Sidebar({ devices, onToggle }: SidebarProps) {
  return (
    <motion.div
      className="w-16 p-2 border-r border-gray-700 flex flex-col items-center justify-start space-y-4 bg-gray-800 text-white overflow-y-hidden max-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex-1 w-full overflow-y-auto overflow-x-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {devices.map((device) => (
          <motion.div key={device.id} variants={itemVariants}>
            <DeviceToggle
              device={device}
              onToggle={() => onToggle(device.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
