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
      className="grid grid-cols-2 md:flex md:flex-wrap 
        items-center gap-3 mb-4 p-4
        bg-gradient-to-r from-gray-800 to-gray-900
        rounded-lg shadow-lg 
        border border-gray-700/50
        backdrop-blur-sm"
    >
      {/* Optimize button layout for mobile */}
      <div className="col-span-2 md:col-auto 
        flex items-center gap-2 w-full md:w-auto">
        {/* Connect Button */}
        <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
          <Button
            variant={isConnected ? "destructive" : "default"}
            onClick={onConnect}
            className={`w-full md:w-auto h-12 px-8
              ${isConnected 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium`}
          >
            {isConnected ? "断开" : "连接"}
          </Button>
        </motion.div>
        
        {/* Clear Button */}
        <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
          <Button
            variant="secondary"
            onClick={onClear}
            className="w-full md:w-auto h-12 px-8
              bg-gray-700 hover:bg-gray-600 
              text-white font-medium"
          >
            清屏
          </Button>
        </motion.div>
      </div>

      {/* Timestamp Button */}
      <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
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

      {/* Save Log Button */}
      <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSaveLog}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2"
        >
          <Save className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Auto Scroll Button */}
      <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
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

      {/* Hex View Button */}
      <motion.div variants={buttonVariants} className="flex-1 md:flex-none">
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
