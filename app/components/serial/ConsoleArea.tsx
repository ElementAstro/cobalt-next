import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FC, RefObject } from "react";
import { SerialData } from "@/types/serial";

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
    <Card className={`flex-1 bg-gray-200 border-blue-600 relative mb-4`}>
      <Textarea
        ref={textareaRef}
        className={`${
          isLandscape ? "h-[calc(100vh-10rem)]" : "h-[50vh]"
        } resize-none bg-transparent border-none focus-visible:ring-0 text-green-400`}
        readOnly
        value={data
          .map(
            (item) =>
              `${
                showTimestamp
                  ? new Date(item.timestamp).toISOString() + " "
                  : ""
              }${item.type.toUpperCase()}: ${
                isHexView ? Buffer.from(item.data).toString("hex") : item.data
              }`
          )
          .join("\n")}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={scrollUp}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={scrollDown}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ConsoleArea;
