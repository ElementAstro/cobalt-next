import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FC, RefObject } from "react";
import { SerialData } from "@/types/serial";
import { motion, AnimatePresence } from "framer-motion";

interface ConsoleAreaProps {
  data: SerialData[];
  showTimestamp: boolean;
  isHexView: boolean;
  isLandscape: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
  scrollUp: () => void;
  scrollDown: () => void;
}

const ConsoleArea: FC<ConsoleAreaProps> = ({
  data,
  showTimestamp,
  isHexView,
  isLandscape,
  textareaRef,
  scrollUp,
  scrollDown,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        flex-1 relative mb-4
        bg-gradient-to-b from-gray-900 to-gray-800
        border border-gray-700/50
        rounded-lg shadow-xl
        overflow-hidden
        backdrop-blur-sm
      `}
    >
      <Textarea
        ref={textareaRef}
        className={`
          ${isLandscape ? "h-[calc(100vh-10rem)]" : "h-[60vh] md:h-[70vh]"}
          resize-none bg-transparent 
          border-none focus-visible:ring-0
          font-mono text-sm leading-relaxed
          text-green-400
          p-4 md:p-6
          overflow-auto
          scrollbar scrollbar-w-2
          scrollbar-track-gray-800
          scrollbar-thumb-gray-600
          hover:scrollbar-thumb-gray-500
          selection:bg-green-500/30
        `}
        readOnly
        value={data
          .map(
            (item) =>
              `${
                showTimestamp
                  ? new Date(item.timestamp).toLocaleString() + " "
                  : ""
              }${item.type.toUpperCase()}: ${
                isHexView ? Buffer.from(item.data).toString("hex") : item.data
              }`
          )
          .join("\n")}
      />

      <div className="absolute right-4 bottom-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="h-10 w-10 bg-gray-800/80 
            hover:bg-gray-700 
            rounded-full shadow-lg
            flex items-center justify-center
            backdrop-blur-sm
            transition-colors"
          onClick={scrollUp}
        >
          <ChevronUp className="h-4 w-4 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="h-10 w-10 bg-gray-800/80 
            hover:bg-gray-700 
            rounded-full shadow-lg
            flex items-center justify-center
            backdrop-blur-sm
            transition-colors"
          onClick={scrollDown}
        >
          <ChevronDown className="h-4 w-4 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ConsoleArea;
