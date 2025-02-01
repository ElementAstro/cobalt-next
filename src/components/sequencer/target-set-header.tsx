"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button as BaseButton } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSequencerStore } from "@/store/useSequencerStore";

const Button = motion(BaseButton);
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
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
      className="flex items-center space-x-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {checked && (
        <motion.div
          className="absolute inset-0 bg-teal-500/10 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
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

export default function TargetSetHeader() {
  const {
    settings,
    setSetting,
    saveSettings,
    notifications,
    errors,
    clearErrors
  } = useSequencerStore();

  useEffect(() => {
    if (errors.length > 0) {
      // 显示错误通知
      setTimeout(clearErrors, 5000);
    }
  }, [errors]);

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
      className="bg-gray-900/50 p-3 rounded-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <header className="p-4 bg-gray-900 rounded-md shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">目标设置</h1>
        {/* ...existing操作按钮或图标... */}
      </header>
      <div className="space-y-3">
        {/* Options Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Start Options */}
          <Collapsible
            open={!isStartOptionsCollapsed}
            onOpenChange={(open) => setIsStartOptionsCollapsed(!open)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center hover:bg-gray-800/50"
              >
                <h2 className="text-sm font-medium">Start Options</h2>
                <ChevronDown
                  className={`h-4 w-4 transform transition-transform ${
                    isStartOptionsCollapsed ? "" : "rotate-180"
                  }`}
                />
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
                <motion.div
                  animate={{ rotate: isEndOptionsCollapsed ? 0 : 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ChevronDown className="h-4 w-4 text-gray-300" />
                </motion.div>
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

        {/* Search Bar */}
        <div className="relative">
          <motion.div className="relative flex-1" layout>
            <motion.div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              animate={{ scale: searchQuery ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="h-4 w-4 text-gray-400" />
            </motion.div>
            <Input
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 transition-all duration-300"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto hover:bg-gray-700/50"
                    onClick={() => setSearchQuery("")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
