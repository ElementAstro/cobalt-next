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
}

export const PropertyControl: React.FC<PropertyControlProps> = ({
  deviceName,
  property,
  onChange,
  onRefresh,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [localValue, setLocalValue] = useState(property.value);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <motion.div
      className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PropertyStateIcon state={property.state} />
      <div className="grid gap-1 flex-1">
        <Label
          htmlFor={`${deviceName}-${property.name}`}
          className="text-sm dark:text-gray-300"
        >
          {property.label}
        </Label>
        {renderControl()}
      </div>
      {isChanging ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          {property.history && property.history.length > 0 && (
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <History className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="dark:text-gray-300">
                    {property.label} 历史记录
                  </DialogTitle>
                </DialogHeader>
                <div className="py-2">
                  <LineChart
                    data={property.history.map((h, index) => ({
                      x: index,
                      ra: h.value as number,
                      dec: 0,
                    }))}
                    width="100%"
                    height={300}
                    darkMode={true}
                    customize={{
                      lineColors: {
                        ra: "#00e676",
                        dec: "transparent",
                      },
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
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
