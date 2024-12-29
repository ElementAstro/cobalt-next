import { motion } from "framer-motion";
import SideBarToggle from "./left-sidebar-toggle";

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

export function Sidebar({ devices, onToggle }: SidebarProps) {
  return (
    <motion.div
      className="p-2 border-r border-gray-700 flex flex-col items-center justify-start space-y-4 bg-gray-800 text-white max-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ width: "5rem" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        variants={scrollVariants}
        initial="hidden"
        animate="visible"
      >
        {devices.map((device) => (
          <motion.div key={device.id} variants={itemVariants}>
            <SideBarToggle
              device={device}
              onToggle={() => onToggle(device.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
