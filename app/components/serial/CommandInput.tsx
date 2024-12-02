import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC, ChangeEvent, KeyboardEvent } from "react";

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
    <div className="flex gap-2">
      <Input
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
      <Button variant="outline" onClick={onSend}>
        发送
      </Button>
      <Button variant="outline" onClick={onAddCustom}>
        <Plus className="h-4 w-4 mr-2" />
        添加
      </Button>
    </div>
  );
};

export default CommandInput;
