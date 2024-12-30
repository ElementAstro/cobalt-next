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
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
};

interface SwitchOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  description?: string;
}

function SwitchOption({
  id,
  label,
  checked,
  onChange,
  description,
}: SwitchOptionProps) {
  return (
    <div className="flex items-center space-x-4">
      <Label
        htmlFor={id}
        className="flex items-center space-x-2 text-sm text-gray-400"
      >
        <span>{label}</span>
        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-teal-500"
      />
    </div>
  );
}

export function TargetSetHeader() {
  const [options, setOptions] = useState<TargetSetOptions>(DEFAULT_OPTIONS);
  const [isStartOptionsCollapsed, setIsStartOptionsCollapsed] = useState(true);
  const [isEndOptionsCollapsed, setIsEndOptionsCollapsed] = useState(true);

  const updateOption = (key: keyof TargetSetOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (category: "start" | "end", value: boolean) => {
    if (category === "start") {
      setOptions((prev) => ({
        ...prev,
        coolCamera: value,
        unparkMount: value,
        meridianFlip: value,
        autoFocus: value,
        dithering: value,
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        warmCamera: value,
        parkMount: value,
        autoCalibrate: value,
        logData: value,
        plateSolve: value,
      }));
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div className="space-y-6">
        {/* 开始选项 */}
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
                    <SwitchOption
                      id="cool-camera"
                      label="Cool Camera"
                      checked={options.coolCamera}
                      onChange={() => updateOption("coolCamera")}
                      description="保持相机冷却"
                    />
                    <SwitchOption
                      id="unpark-mount"
                      label="Unpark Mount"
                      checked={options.unparkMount}
                      onChange={() => updateOption("unparkMount")}
                      description="解锁安装架"
                    />
                    <SwitchOption
                      id="meridian-flip"
                      label="Meridian Flip"
                      checked={options.meridianFlip}
                      onChange={() => updateOption("meridianFlip")}
                      description="经过子午线时翻转安装架"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("start", true)}
                        className="text-teal-500 hover:bg-teal-500/10 transition-colors duration-200"
                      >
                        全部开启
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("start", false)}
                        className="text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        全部关闭
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>

        {/* 结束选项 */}
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
                    <SwitchOption
                      id="warm-camera"
                      label="Warm Camera"
                      checked={options.warmCamera}
                      onChange={() => updateOption("warmCamera")}
                      description="加热相机"
                    />
                    <SwitchOption
                      id="park-mount"
                      label="Park Mount"
                      checked={options.parkMount}
                      onChange={() => updateOption("parkMount")}
                      description="锁定安装架"
                    />
                    <SwitchOption
                      id="auto-calibrate"
                      label="Auto Calibrate"
                      checked={options.autoCalibrate}
                      onChange={() => updateOption("autoCalibrate")}
                      description="自动校准"
                    />
                    <SwitchOption
                      id="log-data"
                      label="Log Data"
                      checked={options.logData}
                      onChange={() => updateOption("logData")}
                      description="记录数据日志"
                    />
                    <SwitchOption
                      id="auto-focus"
                      label="Auto Focus"
                      checked={options.autoFocus}
                      onChange={() => updateOption("autoFocus")}
                      description="自动对焦"
                    />
                    <SwitchOption
                      id="dithering"
                      label="Dithering"
                      checked={options.dithering}
                      onChange={() => updateOption("dithering")}
                      description="减少图像噪声"
                    />
                    <SwitchOption
                      id="plate-solve"
                      label="Plate Solve"
                      checked={options.plateSolve}
                      onChange={() => updateOption("plateSolve")}
                      description="自动解析星图"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("end", true)}
                        className="text-teal-500 hover:bg-teal-500/10 transition-colors duration-200"
                      >
                        全部开启
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleAll("end", false)}
                        className="text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        全部关闭
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
