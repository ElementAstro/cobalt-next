import React, { useState, useCallback, memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"; // 使用 Shadcn 的 Tooltip 组件

interface DeviceWindowProps {
  device: {
    id: string;
    name: string;
    params: { [key: string]: any };
  };
  onParamChange: (deviceId: string, param: string, value: any) => void;
  onClose: () => void;
}

const DeviceWindow: React.FC<DeviceWindowProps> = memo(
  ({ device, onParamChange, onClose }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: device.id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    const handleChange = useCallback(
      (key: string, value: any) => {
        onParamChange(device.id, key, value);
      },
      [device.id, onParamChange]
    );

    const handleSearch = useCallback((query: string) => {
      // 实现搜索功能
      console.log("搜索查询:", query);
    }, []);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="absolute top-4 left-4 bg-gray-800 border border-gray-700 rounded-lg p-4 w-80 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{device.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <InputSearch onSearch={handleSearch} />
          {Object.entries(device.params).map(([key, value]) =>
            renderParam(key, value, device.id, handleChange)
          )}
        </div>
      </div>
    );
  }
);

function renderParam(
  key: string,
  value: any,
  deviceId: string,
  onParamChange: (param: string, value: any) => void
) {
  const renderInput = () => {
    switch (typeof value) {
      case "boolean":
        return (
          <Switch
            id={`${deviceId}-${key}`}
            checked={value}
            onCheckedChange={(checked) => onParamChange(key, checked)}
          />
        );
      case "number":
        return (
          <Input
            id={`${deviceId}-${key}`}
            type="number"
            value={value}
            onChange={(e) => onParamChange(key, parseFloat(e.target.value))}
            className="w-20"
          />
        );
      case "string":
        return (
          <Input
            id={`${deviceId}-${key}`}
            type="text"
            value={value}
            onChange={(e) => onParamChange(key, e.target.value)}
            className="w-full"
          />
        );
      case "object":
        if (Array.isArray(value)) {
          return (
            <Select
              value={value[0]}
              onValueChange={(selectedValue) =>
                onParamChange(key, selectedValue)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择选项" />
              </SelectTrigger>
              <SelectContent>
                {value.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return <span>{value}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div key={key} className="flex items-center justify-between">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor={`${deviceId}-${key}`}>{key}:</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>配置 {key}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {renderInput()}
    </div>
  );
}

interface InputSearchProps {
  onSearch: (query: string) => void;
}

const InputSearch: React.FC<InputSearchProps> = memo(({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-2">
      <Input
        type="text"
        placeholder="搜索参数..."
        value={query}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
});

export default DeviceWindow;
