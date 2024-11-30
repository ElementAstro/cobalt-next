"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TargetSetOptions } from "@/types/sequencer";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function TargetSetHeader() {
  const [options, setOptions] = useState<TargetSetOptions>({
    coolCamera: false,
    unparkMount: true,
    meridianFlip: false,
    warmCamera: false,
    parkMount: false,
  });

  const [isStartOptionsCollapsed, setIsStartOptionsCollapsed] = useState(false);
  const [isEndOptionsCollapsed, setIsEndOptionsCollapsed] = useState(false);

  const updateOption = (key: keyof TargetSetOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-900/50 p-4">
      <div className="space-y-4">
        <Collapsible
          open={!isStartOptionsCollapsed}
          onOpenChange={setIsStartOptionsCollapsed}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-sm font-medium text-teal-500">
                Target Set Start Options
              </h2>
              {isStartOptionsCollapsed ? (
                <ChevronDown className="h-4 w-4 text-teal-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-teal-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <div>
                <Label htmlFor="cool-camera" className="text-sm text-gray-400">
                  Cool Camera
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="cool-camera"
                    checked={options.coolCamera}
                    onCheckedChange={() => updateOption("coolCamera")}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <span className="text-xs text-gray-500">OFF</span>
                </div>
              </div>
              <div>
                <Label htmlFor="unpark-mount" className="text-sm text-gray-400">
                  Unpark Mount
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="unpark-mount"
                    checked={options.unparkMount}
                    onCheckedChange={() => updateOption("unparkMount")}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <span className="text-xs text-gray-500">ON</span>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="meridian-flip"
                  className="text-sm text-gray-400"
                >
                  Meridian Flip
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="meridian-flip"
                    checked={options.meridianFlip}
                    onCheckedChange={() => updateOption("meridianFlip")}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <span className="text-xs text-gray-500">OFF</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={!isEndOptionsCollapsed}
          onOpenChange={setIsEndOptionsCollapsed}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-sm font-medium text-teal-500">
                Target Set End Options
              </h2>
              {isEndOptionsCollapsed ? (
                <ChevronDown className="h-4 w-4 text-teal-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-teal-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <div>
                <Label htmlFor="warm-camera" className="text-sm text-gray-400">
                  Warm Camera
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="warm-camera"
                    checked={options.warmCamera}
                    onCheckedChange={() => updateOption("warmCamera")}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <span className="text-xs text-gray-500">OFF</span>
                </div>
              </div>
              <div>
                <Label htmlFor="park-mount" className="text-sm text-gray-400">
                  Park Mount
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="park-mount"
                    checked={options.parkMount}
                    onCheckedChange={() => updateOption("parkMount")}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  <span className="text-xs text-gray-500">OFF</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
