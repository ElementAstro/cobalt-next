"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface TargetSetOptions {
  coolCamera: boolean;
  unparkMount: boolean;
  meridianFlip: boolean;
  warmCamera: boolean;
  parkMount: boolean;
  autoCalibrate: boolean;
  logData: boolean;
  autoFocus: boolean;
  dithering: boolean;
  plateSolve: boolean;
  polarAlignment: boolean;
  autoGuide: boolean;
  temperatureControl: boolean;
  weatherMonitoring: boolean;
  safetyChecks: boolean;
}

const DEFAULT_OPTIONS: TargetSetOptions = {
  coolCamera: false,
  unparkMount: true,
  meridianFlip: false,
  warmCamera: false,
  parkMount: false,
  autoCalibrate: false,
  logData: false,
  autoFocus: false,
  dithering: true,
  plateSolve: false,
  polarAlignment: false,
  autoGuide: false,
  temperatureControl: false,
  weatherMonitoring: false,
  safetyChecks: true,
};

interface SwitchOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  description?: string;
  category?: string;
}

function SwitchOption({
  id,
  label,
  checked,
  onChange,
  description,
  category,
}: SwitchOptionProps) {
  return (
    <motion.div
      className="flex items-center space-x-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <Label
          htmlFor={id}
          className="flex flex-col space-y-1 text-sm text-gray-300"
        >
          <div className="flex items-center space-x-2">
            <span>{label}</span>
            {category && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">
                {category}
              </span>
            )}
          </div>
          {description && (
            <span className="text-xs text-gray-400">{description}</span>
          )}
        </Label>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-teal-500"
      />
    </motion.div>
  );
}

export function TargetSetHeader() {
  const [options, setOptions] = useState<TargetSetOptions>(DEFAULT_OPTIONS);
  const [isStartOptionsCollapsed, setIsStartOptionsCollapsed] = useState(true);
  const [isEndOptionsCollapsed, setIsEndOptionsCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const updateOption = (key: keyof TargetSetOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (category: "start" | "end", value: boolean) => {
    const optionsToUpdate =
      category === "start"
        ? [
            "coolCamera",
            "unparkMount",
            "meridianFlip",
            "autoFocus",
            "dithering",
            "polarAlignment",
            "autoGuide",
          ]
        : [
            "warmCamera",
            "parkMount",
            "autoCalibrate",
            "logData",
            "plateSolve",
            "temperatureControl",
            "weatherMonitoring",
            "safetyChecks",
          ];

    const updatedOptions = optionsToUpdate.reduce(
      (acc, key) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );

    setOptions((prev) => ({ ...prev, ...updatedOptions }));
  };

  const filteredOptions = (
    optionsList: {
      id: string;
      label: string;
      description?: string;
      category?: string;
    }[]
  ) => {
    return optionsList.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description &&
          option.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const startOptions = filteredOptions([
    {
      id: "cool-camera",
      label: "Cool Camera",
      description: "保持相机冷却",
      category: "Temperature",
    },
    {
      id: "unpark-mount",
      label: "Unpark Mount",
      description: "解锁安装架",
      category: "Mount",
    },
    {
      id: "meridian-flip",
      label: "Meridian Flip",
      description: "经过子午线时翻转安装架",
      category: "Mount",
    },
    {
      id: "polar-alignment",
      label: "Polar Alignment",
      description: "自动极轴校准",
      category: "Alignment",
    },
    {
      id: "auto-guide",
      label: "Auto Guide",
      description: "自动导星",
      category: "Guiding",
    },
  ]);

  const endOptions = filteredOptions([
    {
      id: "warm-camera",
      label: "Warm Camera",
      description: "加热相机",
      category: "Temperature",
    },
    {
      id: "park-mount",
      label: "Park Mount",
      description: "锁定安装架",
      category: "Mount",
    },
    {
      id: "auto-calibrate",
      label: "Auto Calibrate",
      description: "自动校准",
      category: "Calibration",
    },
    {
      id: "log-data",
      label: "Log Data",
      description: "记录数据日志",
      category: "Logging",
    },
    {
      id: "plate-solve",
      label: "Plate Solve",
      description: "自动解析星图",
      category: "Imaging",
    },
    {
      id: "temperature-control",
      label: "Temperature Control",
      description: "自动温度调节",
      category: "Temperature",
    },
    {
      id: "weather-monitoring",
      label: "Weather Monitoring",
      description: "实时天气监控",
      category: "Safety",
    },
    {
      id: "safety-checks",
      label: "Safety Checks",
      description: "安全系统检查",
      category: "Safety",
    },
  ]);

  return (
    <motion.div
      className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </div>

        {/* Start Options */}
        <Collapsible
          open={!isStartOptionsCollapsed}
          onOpenChange={(open) => setIsStartOptionsCollapsed(!open)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-left hover:scale-[1.02] transition-transform duration-200"
            >
              <h2 className="text-sm font-medium text-gray-300">
                Target Set Start Options
              </h2>
              {isStartOptionsCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-300" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-300" />
              )}
            </Button>
          </CollapsibleTrigger>
          <AnimatePresence>
            {!isStartOptionsCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  opacity: { duration: 0.2 },
                }}
                style={{ overflow: "hidden" }}
              >
                <CollapsibleContent>
                  <div className="space-y-4 mt-2">
                    {startOptions.map((option) => (
                      <SwitchOption
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        checked={options[option.id as keyof TargetSetOptions]}
                        onChange={() =>
                          updateOption(option.id as keyof TargetSetOptions)
                        }
                        description={option.description}
                        category={option.category}
                      />
                    ))}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("start", true)}
                        className="text-teal-500 hover:bg-teal-500/10 transition-colors duration-200"
                      >
                        Enable All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("start", false)}
                        className="text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>

        {/* End Options */}
        <Collapsible
          open={!isEndOptionsCollapsed}
          onOpenChange={(open) => setIsEndOptionsCollapsed(!open)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-left hover:scale-[1.02] transition-transform duration-200"
            >
              <h2 className="text-sm font-medium text-gray-300">
                Target Set End Options
              </h2>
              {isEndOptionsCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-300" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-300" />
              )}
            </Button>
          </CollapsibleTrigger>
          <AnimatePresence>
            {!isEndOptionsCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  opacity: { duration: 0.2 },
                }}
                style={{ overflow: "hidden" }}
              >
                <CollapsibleContent>
                  <div className="space-y-4 mt-2">
                    {endOptions.map((option) => (
                      <SwitchOption
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        checked={options[option.id as keyof TargetSetOptions]}
                        onChange={() =>
                          updateOption(option.id as keyof TargetSetOptions)
                        }
                        description={option.description}
                        category={option.category}
                      />
                    ))}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("end", true)}
                        className="text-teal-500 hover:bg-teal-500/10 transition-colors duration-200"
                      >
                        Enable All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("end", false)}
                        className="text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>
      </div>
    </motion.div>
  );
}
