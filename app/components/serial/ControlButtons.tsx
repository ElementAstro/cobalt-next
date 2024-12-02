import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";

interface ControlButtonsProps {
  onConnect: () => void;
  isConnected: boolean;
  onClear: () => void;
  showTimestamp: boolean;
  toggleTimestamp: () => void;
  onSaveLog: () => void;
  isAutoScroll: boolean;
  toggleAutoScroll: () => void;
  isHexView: boolean;
  toggleHexView: () => void;
  rxCount: number;
  txCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ControlButtons: FC<ControlButtonsProps> = ({
  onConnect,
  isConnected,
  onClear,
  showTimestamp,
  toggleTimestamp,
  onSaveLog,
  isAutoScroll,
  toggleAutoScroll,
  isHexView,
  toggleHexView,
  rxCount,
  txCount,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900"
    >
      <motion.div variants={buttonVariants}>
        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={onConnect}
          disabled={!isConnected && isConnected !== false}
          className={`${
            isConnected
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isConnected ? "断开" : "连接"}
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          variant="secondary"
          onClick={onClear}
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          清屏
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTimestamp}
          className={`${
            showTimestamp ? "bg-green-500" : "bg-gray-700"
          } text-white rounded-full p-2`}
        >
          T
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSaveLog}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
        >
          <Save className="h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          variant={isAutoScroll ? "default" : "secondary"}
          onClick={toggleAutoScroll}
          className={`${
            isAutoScroll
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          } text-white`}
        >
          自动滚动
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          variant={isHexView ? "default" : "secondary"}
          onClick={toggleHexView}
          className={`${
            isHexView
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          } text-white`}
        >
          Hex 视图
        </Button>
      </motion.div>

      <motion.div
        variants={buttonVariants}
        className="flex items-center gap-4 ml-auto text-white"
      >
        <span>RX {rxCount}</span>
        <span>TX {txCount}</span>
      </motion.div>
    </motion.div>
  );
};

export default ControlButtons;
