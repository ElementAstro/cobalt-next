import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
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

interface DeviceWindowProps {
  device: {
    id: string;
    name: string;
    params: { [key: string]: any };
  };
  onParamChange: (deviceId: string, param: string, value: any) => void;
  onClose: () => void;
}

export default function DeviceWindow({
  device,
  onParamChange,
  onClose,
}: DeviceWindowProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: device.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute top-4 left-4 bg-gray-800 border border-gray-700 rounded-lg p-4 w-64 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{device.name}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {Object.entries(device.params).map(([key, value]) =>
          renderParam(key, value, device.id, onParamChange)
        )}
      </div>
    </div>
  );
}

function renderParam(
  key: string,
  value: any,
  deviceId: string,
  onParamChange: (deviceId: string, param: string, value: any) => void
) {
  if (typeof value === "boolean") {
    return (
      <div key={key} className="flex items-center justify-between">
        <Label htmlFor={`${deviceId}-${key}`}>{key}:</Label>
        <Switch
          id={`${deviceId}-${key}`}
          checked={value}
          onCheckedChange={(checked) => onParamChange(deviceId, key, checked)}
        />
      </div>
    );
  } else if (typeof value === "number") {
    return (
      <div key={key} className="flex items-center space-x-2">
        <Label htmlFor={`${deviceId}-${key}`}>{key}:</Label>
        <Input
          id={`${deviceId}-${key}`}
          type="number"
          value={value}
          onChange={(e) =>
            onParamChange(deviceId, key, parseFloat(e.target.value))
          }
          className="w-20"
        />
      </div>
    );
  } else if (Array.isArray(value)) {
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={`${deviceId}-${key}`}>{key}:</Label>
        <Select
          value={value[0]}
          onValueChange={(selectedValue) =>
            onParamChange(deviceId, key, selectedValue)
          }
        >
          <SelectTrigger id={`${deviceId}-${key}`}>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {value.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  } else {
    return (
      <div key={key} className="flex items-center justify-between">
        <Label htmlFor={`${deviceId}-${key}`}>{key}:</Label>
        <span>{value}</span>
      </div>
    );
  }
}
