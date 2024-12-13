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
      className={`flex-1 bg-gray-900 border border-gray-700 relative mb-4 
        rounded-lg shadow-lg overflow-hidden`}
    >
      <Textarea
        ref={textareaRef}
        className={`${
          isLandscape ? "h-[calc(100vh-10rem)]" : "h-[60vh] md:h-[70vh]"
        } resize-none bg-transparent border-none focus-visible:ring-0 
        text-green-400 p-4 overflow-auto font-mono text-sm
        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900`}
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

      <AnimatePresence>
        <motion.div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center"
            onClick={scrollUp}
          >
            <ChevronUp className="h-4 w-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center"
            onClick={scrollDown}
          >
            <ChevronDown className="h-4 w-4 text-white" />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ConsoleArea;
