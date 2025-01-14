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
import {
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Trash,
  Check,
  X,
  Loader2,
  AlertCircle,
  Settings,
  Focus,
  RefreshCw,
  Save,
  Bell,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isSaving, setIsSaving] = useState(false);

  const [autofocusSettings, setAutofocusSettings] = useState({
    enabled: false,
    interval: 30,
    temperature: 2,
    filterChange: true,
    beforeImaging: true,
    method: "HFD",
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
    errorHandling: "continue",
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

  const saveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex justify-between items-center hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Focus className="h-4 w-4" />
            <span>自动聚焦设置</span>
          </div>
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {isCollapsed ? <ChevronDown /> : <ChevronUp />}
          </motion.div>
        </Button>
      </CollapsibleTrigger>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CollapsibleContent>
              <div className="bg-gray-900/50 p-4 space-y-4">
                {/* 目标设置部分 */}
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <div className="flex flex-wrap gap-1 overflow-x-auto">
                    {targets.map((target) => (
                      <motion.div
                        key={target.id}
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Button
                          variant={
                            target.id === activeTargetId ? "default" : "outline"
                          }
                          onClick={() => setActiveTargetId(target.id)}
                          className="whitespace-nowrap bg-gray-800 text-white border-gray-700 hover:bg-gray-700 px-2 py-1 text-sm flex items-center gap-1"
                        >
                          {target.id === activeTargetId && (
                            <Check className="h-3 w-3" />
                          )}
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
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    <Button
                      onClick={addTarget}
                      className="bg-teal-500 text-white hover:bg-teal-600 flex items-center gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      添加目标
                    </Button>

                    <Button
                      onClick={exportJson}
                      className="bg-teal-500 text-white hover:bg-teal-600 flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      导出
                    </Button>

                    <Label className="bg-teal-500 text-white hover:bg-teal-600 flex items-center cursor-pointer px-3 gap-1">
                      <Upload className="h-4 w-4" />
                      导入
                      <Input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={importJson}
                      />
                    </Label>
                  </div>
                </div>

                {/* 任务列表部分 */}
                {isMobile ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700 flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        编辑任务
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-screen h-screen max-w-none m-0 bg-gray-900 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-teal-500 flex items-center gap-1">
                          <Focus className="h-5 w-5" />
                          编辑 {activeTarget.name} 的任务
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

                {/* 自动聚焦设置部分 */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <h3 className="text-base font-medium text-white mb-2 flex items-center gap-1">
                      <Focus className="h-5 w-5" />
                      自动聚焦设置
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* 设置项... */}
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center gap-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        保存设置
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CollapsibleContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
