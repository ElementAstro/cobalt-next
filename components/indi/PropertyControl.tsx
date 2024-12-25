import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, History } from "lucide-react";
import { INDIProperty, PropertyState } from "@/types/indi";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LineChart from "@/components/chart/LineChart";

interface PropertyControlProps {
  deviceName: string;
  property: INDIProperty;
  onChange: (
    deviceName: string,
    propertyName: string,
    value: string | number | boolean
  ) => Promise<void>;
  onRefresh: (deviceName: string, propertyName: string) => Promise<void>;
  onDoubleClick?: () => void;
  onHistoryExport?: () => void;
}

export const PropertyControl: React.FC<PropertyControlProps> = ({
  deviceName,
  property,
  onChange,
  onRefresh,
  onDoubleClick,
  onHistoryExport,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [localValue, setLocalValue] = useState(property.value);
  const [showHistory, setShowHistory] = useState(false);
  const [pressTimer, setPressTimer] = React.useState<NodeJS.Timeout | null>(
    null
  );
  const [showTrendline, setShowTrendline] = useState(false);

  useEffect(() => {
    setLocalValue(property.value);
  }, [property.value]);

  const handleChange = async (value: string | number | boolean) => {
    setIsChanging(true);
    setLocalValue(value);
    try {
      await onChange(deviceName, property.name, value);
      toast({
        title: "属性已更新",
        description: `${property.label} 已更新为 ${value}`,
      });
    } catch (error) {
      toast({
        title: "更新失败",
        description: `更新 ${property.label} 失败`,
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await onRefresh(deviceName, property.name);
      toast({
        title: "属性已刷新",
        description: `${property.label} 已刷新`,
      });
    } catch (error) {
      toast({
        title: "刷新失败",
        description: `刷新 ${property.label} 失败`,
        variant: "destructive",
      });
    }
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowHistory(true);
    }, 1000);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const renderControl = () => {
    switch (property.type) {
      case "text":
        return (
          <Input
            value={localValue as string}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => handleChange(localValue as string)}
            disabled={isChanging || property.perm === "ro"}
            className="text-sm"
          />
        );
      case "number":
        return (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={localValue as number}
              onChange={(e) => setLocalValue(parseFloat(e.target.value))}
              onBlur={() => handleChange(localValue as number)}
              min={property.min}
              max={property.max}
              step={property.step}
              disabled={isChanging || property.perm === "ro"}
              className="text-sm w-20"
            />
            <Slider
              value={[localValue as number]}
              onValueChange={(value) => setLocalValue(value[0])}
              onValueCommit={() => handleChange(localValue as number)}
              min={property.min}
              max={property.max}
              step={property.step}
              className="w-24"
              disabled={isChanging || property.perm === "ro"}
            />
          </div>
        );
      case "switch":
        return (
          <Switch
            checked={localValue as boolean}
            onCheckedChange={handleChange}
            disabled={isChanging || property.perm === "ro"}
          />
        );
      case "light":
        return (
          <div className={`w-4 h-4 rounded-full bg-${property.value}-500`} />
        );
      case "blob":
        return (
          <Button
            onClick={() => handleChange("blob")}
            disabled={isChanging || property.perm === "ro"}
            className="text-sm"
          >
            上传
          </Button>
        );
      default:
        return null;
    }
  };

  const renderHistoryChart = () => (
    <div className="py-2">
      <div className="flex justify-between mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTrendline(!showTrendline)}
        >
          {showTrendline ? "隐藏趋势线" : "显示趋势线"}
        </Button>
        <Button variant="outline" size="sm" onClick={onHistoryExport}>
          导出数据
        </Button>
      </div>
      <LineChart
        data={
          property.history?.map((h, index) => ({
            x: index,
            ra: h.value as number,
            dec: 0,
          })) || []
        }
        width="100%"
        height={300}
        darkMode={true}
        customize={{
          lineColors: { ra: "#00e676", dec: "transparent" },
          trending: showTrendline,
        }}
      />
    </div>
  );

  return (
    <motion.div
      className="flex items-center gap-1 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={onDoubleClick}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PropertyStateIcon state={property.state} />
      <div className="grid gap-0.5 flex-1 min-w-0">
        <Label
          htmlFor={`${deviceName}-${property.name}`}
          className="text-xs dark:text-gray-300 truncate"
        >
          {property.label}
        </Label>
        <div className="flex items-center gap-1">
          {renderControl()}
          <div className="flex gap-0.5">
            {isChanging ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-6 w-6"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                {property.history && property.history.length > 0 && (
                  <Dialog open={showHistory} onOpenChange={setShowHistory}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <History className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] h-[80vh]">
                      {/* ...现有的对话框内容... */}
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PropertyStateIcon = ({ state }: { state: PropertyState }) => {
  switch (state) {
    case "Idle":
      return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    case "Ok":
      return <div className="w-4 h-4 rounded-full bg-green-500" />;
    case "Busy":
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    case "Alert":
      return <div className="w-4 h-4 rounded-full bg-red-500" />;
  }
};
