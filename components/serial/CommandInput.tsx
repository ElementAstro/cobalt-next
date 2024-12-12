import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface CommandInputProps {
  inputCommand: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onAddCustom: () => void;
}

const CommandInput: FC<CommandInputProps> = ({
  inputCommand,
  onInputChange,
  onSend,
  onAddCustom,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col md:flex-row gap-2"
    >
      <Input
        className="flex-1 bg-gray-800 border-gray-700 text-gray-100
          focus:ring-blue-500 focus:border-blue-500"
        placeholder="输入命令..."
        value={inputCommand}
        onChange={onInputChange}
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <motion.div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onSend}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          发送
        </Button>
        <Button
          variant="outline"
          onClick={onAddCustom}
          className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CommandInput;
