"use client";

import { useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExposureTaskList } from "./exposure-task-list";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, Upload, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Target {
  id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  enabled: boolean;
  progress: [number, number];
  total: number;
  time: string;
  type: string;
  filter: string;
  binning: string;
}

export function AutofocusSettings() {
  const [targets, setTargets] = useState<Target[]>([
    {
      id: "1",
      name: "Target 1",
      tasks: [
        {
          id: "1",
          name: "Autofocus",
          enabled: true,
          progress: [0, 1],
          total: 1,
          time: "1s",
          type: "LIGHT",
          filter: "",
          binning: "1x1",
        },
      ],
    },
  ]);
  const [activeTargetId, setActiveTargetId] = useState(targets[0].id);
  const [dither, setDither] = useState(false);
  const [ditherEvery, setDitherEvery] = useState<number | null>(null);
  const [gain, setGain] = useState("(Camera)");
  const [offset, setOffset] = useState("(Camera)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [autofocusSettings, setAutofocusSettings] = useState({
    enabled: false,
    interval: 30,
    temperature: 2,
    filterChange: true,
    beforeImaging: true,
    method: "HFD", // HFD, FWHM, or Contrast
    stepSize: 10,
    tolerance: 0.5,
    maxIterations: 10,
    retryOnFail: true,
    useVCurve: false,
    saveResults: true,
    alertOnComplete: true,
  });

  const [batchProcess, setBatchProcess] = useState({
    enabled: false,
    concurrent: 1,
    retryCount: 3,
    errorHandling: "continue", // 'stop', 'skip', 'continue'
  });

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const addTarget = () => {
    const newTarget: Target = {
      id: Date.now().toString(),
      name: `Target ${targets.length + 1}`,
      tasks: [],
    };
    setTargets([...targets, newTarget]);
    setActiveTargetId(newTarget.id);
  };

  const deleteTarget = (targetId: string) => {
    setTargets(targets.filter((target) => target.id !== targetId));
    if (activeTargetId === targetId && targets.length > 1) {
      setActiveTargetId(targets[0].id);
    }
  };

  const updateTasks = (targetId: string, newTasks: Task[]) => {
    setTargets(
      targets.map((target) =>
        target.id === targetId ? { ...target, tasks: newTasks } : target
      )
    );
  };

  const importJson = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
          if (e.target && typeof e.target.result === "string") {
            const data = JSON.parse(e.target.result);
            setTargets(data.targets);
            setDither(data.dither);
            setDitherEvery(data.ditherEvery);
            setGain(data.gain);
            setOffset(data.offset);
          }
        };
      }
    },
    []
  );

  const activeTarget =
    targets.find((target) => target.id === activeTargetId) || targets[0];

  const exportJson = useCallback(() => {
    const data = {
      targets,
      dither,
      ditherEvery,
      gain,
      offset,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "target_set_data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [targets, dither, ditherEvery, gain, offset]);

  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex justify-between items-center"
        >
          <span>Target Set</span>
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-gray-900/50 p-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="flex flex-wrap gap-1 overflow-x-auto">
              {targets.map((target) => (
                <div key={target.id} className="flex items-center gap-1">
                  <Button
                    variant={
                      target.id === activeTargetId ? "default" : "outline"
                    }
                    onClick={() => setActiveTargetId(target.id)}
                    className="whitespace-nowrap bg-gray-800 text-white border-gray-700 hover:bg-gray-700 px-2 py-1 text-sm"
                  >
                    {target.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTarget(target.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button
                onClick={addTarget}
                className="bg-teal-500 text-white hover:bg-teal-600"
              >
                Add Target
              </Button>
              <Button
                onClick={exportJson}
                className="bg-teal-500 text-white hover:bg-teal-600 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              // Inside your component
              <Label className="bg-teal-500 text-white hover:bg-teal-600 flex items-center cursor-pointer px-3">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <Input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importJson}
                />
              </Label>
            </div>
          </div>

          {isMobile ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Edit Tasks
                </Button>
              </DialogTrigger>
              <DialogContent className="w-screen h-screen max-w-none m-0 bg-gray-900 text-white">
                <DialogHeader>
                  <DialogTitle className="text-teal-500">
                    Edit Tasks for {activeTarget.name}
                  </DialogTitle>
                </DialogHeader>
                <ExposureTaskList
                  tasks={activeTarget.tasks}
                  onTasksChange={(newTasks) =>
                    updateTasks(activeTargetId, newTasks)
                  }
                />
              </DialogContent>
            </Dialog>
          ) : (
            <ExposureTaskList
              tasks={activeTarget.tasks}
              onTasksChange={(newTasks) =>
                updateTasks(activeTargetId, newTasks)
              }
            />
          )}

          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2`}
          >
            <div>
              <Label className="text-sm text-gray-400">Dither</Label>
              <div className="flex items-center space-x-2">
                <Switch checked={dither} onCheckedChange={setDither} />
                <span className="text-gray-300">{dither ? "ON" : "OFF"}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-400">Dither every #</Label>
              <Input
                type="number"
                value={ditherEvery ?? ""}
                onChange={(e) =>
                  setDitherEvery(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Enter number"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400">Gain</Label>
              <Input
                type="text"
                value={gain}
                onChange={(e) => setGain(e.target.value)}
                placeholder="Gain value"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400">Offset</Label>
              <Input
                type="text"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                placeholder="Offset value"
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-base font-medium text-white mb-2">
                自动聚焦设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center justify-between">
                  <Label>启用自动聚焦</Label>
                  <Switch
                    checked={autofocusSettings.enabled}
                    onCheckedChange={(checked) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        enabled: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>聚焦方法</Label>
                  <select
                    value={autofocusSettings.method}
                    onChange={(e) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        method: e.target.value,
                      }))
                    }
                    className="bg-gray-700 text-white rounded px-2 py-1"
                  >
                    <option value="HFD">HFD</option>
                    <option value="FWHM">FWHM</option>
                    <option value="Contrast">Contrast</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>步长</Label>
                  <Input
                    type="number"
                    value={autofocusSettings.stepSize}
                    onChange={(e) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        stepSize: Number(e.target.value),
                      }))
                    }
                    className="w-20 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>容差</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={autofocusSettings.tolerance}
                    onChange={(e) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        tolerance: Number(e.target.value),
                      }))
                    }
                    className="w-20 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>最大迭代次数</Label>
                  <Input
                    type="number"
                    value={autofocusSettings.maxIterations}
                    onChange={(e) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        maxIterations: Number(e.target.value),
                      }))
                    }
                    className="w-20 bg-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>失败重试</Label>
                  <Switch
                    checked={autofocusSettings.retryOnFail}
                    onCheckedChange={(checked) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        retryOnFail: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>使用V曲线</Label>
                  <Switch
                    checked={autofocusSettings.useVCurve}
                    onCheckedChange={(checked) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        useVCurve: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>保存结果</Label>
                  <Switch
                    checked={autofocusSettings.saveResults}
                    onCheckedChange={(checked) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        saveResults: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>完成时提醒</Label>
                  <Switch
                    checked={autofocusSettings.alertOnComplete}
                    onCheckedChange={(checked) =>
                      setAutofocusSettings((prev) => ({
                        ...prev,
                        alertOnComplete: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-base font-medium text-white mb-2">
                批处理设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* 添加批处理设置项 */}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
