import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FC } from "react";

interface CustomCommandsProps {
  commands: string[];
  onSend: (cmd: string) => void;
  onRemove: (index: number) => void;
}

const CustomCommands: FC<CustomCommandsProps> = ({
  commands,
  onSend,
  onRemove,
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {commands.map((cmd, index) => (
        <div key={index} className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onSend(cmd)}>
            {cmd}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onRemove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomCommands;
