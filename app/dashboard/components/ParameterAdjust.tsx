import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  History,
  Save,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useExposureStore } from "@/lib/store/dashboard";

function parseShutterSpeed(value: string): number {
  if (value.includes("/")) {
    const [num, denom] = value.split("/");
    return parseFloat(num) / parseFloat(denom);
  }
  return parseFloat(value);
}
interface ParameterAdjustProps {
  parameter: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

interface ParameterPreset {
  name: string;
  values: Record<string, string>;
}

const parameterInfo: Record<string, string> = {
  shutterSpeed: "控制曝光时间，数值越大表示快门开启时间越长",
  iso: "感光度，数值越高噪点越多",
  aperture: "光圈大小，数值越小景深越浅",
  focusPoint: "对焦点位置",
  filterType: "滤镜类型",
};

const presets: ParameterPreset[] = [
  {
    name: "深空",
    values: {
      shutterSpeed: "30",
      iso: "3200",
      aperture: "f/2.8",
    },
  },
  {
    name: "月球",
    values: {
      shutterSpeed: "1/125",
      iso: "400",
      aperture: "f/8",
    },
  },
];

export default function ParameterAdjust({
  parameter,
  value,
  onChange,
  onClose,
}: ParameterAdjustProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { toast } = useToast();
  const {
    exposureTime,
    iso,
    aperture,
    focusPoint,
    filterType,
    gain,
    offset,
    binning,
    setExposureTime,
    setISO,
    setAperture,
    setFocusPoint,
    setFilterType,
    setGain,
    setOffset,
    setBinning,
  } = useExposureStore();

  const handleSave = () => {
    switch (parameter) {
      case "shutterSpeed":
        setExposureTime(parseShutterSpeed(currentValue) || 1);
        break;
      case "iso":
        setISO(parseInt(currentValue) || 100);
        break;
      case "aperture":
        setAperture(parseFloat(currentValue) || 2.8);
        break;
      case "focusPoint":
        setFocusPoint(parseInt(currentValue) || 50);
        break;
      case "filterType":
        setFilterType(currentValue || "None");
        break;
      case "gain":
        setGain(parseFloat(currentValue) || 0);
        break;
      case "offset":
        setOffset(parseFloat(currentValue) || 0);
        break;
      case "binning":
        setBinning(currentValue || "1x1");
        break;
    }
    onChange?.(currentValue);
    toast({
      title: "参数已保存",
      description: `${parameter}: ${currentValue}`,
    });
    onClose();
  };

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    let storeValue = "";
    switch (parameter) {
      case "shutterSpeed":
        storeValue = exposureTime.toString();
        break;
      case "iso":
        storeValue = iso.toString();
        break;
      case "aperture":
        storeValue = aperture.toString();
        break;
      case "focusPoint":
        storeValue = focusPoint.toString();
        break;
      case "filterType":
        storeValue = filterType;
        break;
      case "gain":
        storeValue = gain.toString();
        break;
      case "offset":
        storeValue = offset.toString();
        break;
      case "binning":
        storeValue = binning;
        break;
    }
    setCurrentValue(storeValue);
  }, [parameter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
      if (e.key === "ArrowLeft") handleHistoryNav(-1);
      if (e.key === "ArrowRight") handleHistoryNav(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentValue]);

  const handleChange = (newValue: string) => {
    setCurrentValue(newValue);
    setHistory([...history.slice(0, historyIndex + 1), newValue]);
    setHistoryIndex(historyIndex + 1);
  };

  const handleHistoryNav = (delta: number) => {
    const newIndex = historyIndex + delta;
    if (newIndex >= 0 && newIndex < history.length) {
      setHistoryIndex(newIndex);
      setCurrentValue(history[newIndex]);
    }
  };

  const applyPreset = (preset: ParameterPreset) => {
    if (preset.values[parameter]) {
      handleChange(preset.values[parameter]);
    }
  };

  const renderControl = () => {
    switch (parameter) {
      case "shutterSpeed":
        return (
          <div className="space-y-2">
            <Select value={currentValue} onValueChange={handleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择快门速度" />
              </SelectTrigger>
              <SelectContent>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    "1/1000",
                    "1/500",
                    "1/250",
                    "1/125",
                    "1/60",
                    "1/30",
                    "1/15",
                    "1/8",
                    "1/4",
                    "1/2",
                    "1",
                    "2",
                    "4",
                    "8",
                    "15",
                    "30",
                  ].map((speed) => (
                    <SelectItem key={speed} value={speed}>
                      {speed}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChange("1/1000")}
              >
                最快
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChange("30")}
              >
                最慢
              </Button>
            </div>
          </div>
        );
      // 其他case保持不变...
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-sm overflow-hidden"
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-lg font-semibold">
              {parameter.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{parameterInfo[parameter]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="adjust" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="adjust">调整</TabsTrigger>
            <TabsTrigger value="presets">预设</TabsTrigger>
            <TabsTrigger value="history">历史</TabsTrigger>
          </TabsList>

          <TabsContent value="adjust" className="p-4">
            {renderControl()}
          </TabsContent>

          <TabsContent value="presets" className="p-4">
            <ScrollArea className="h-48">
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => applyPreset(preset)}
                    className="h-auto py-2"
                  >
                    <div className="text-left">
                      <div>{preset.name}</div>
                      <div className="text-xs text-gray-400">
                        {Object.entries(preset.values)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="p-4">
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {history.map((val, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      index === historyIndex ? "bg-primary/20" : ""
                    }`}
                    onClick={() => {
                      setHistoryIndex(index);
                      setCurrentValue(val);
                    }}
                  >
                    <span>{val}</span>
                    {index === historyIndex && (
                      <Badge variant="outline">当前</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleHistoryNav(-1)}
              disabled={historyIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleHistoryNav(1)}
              disabled={historyIndex === history.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
