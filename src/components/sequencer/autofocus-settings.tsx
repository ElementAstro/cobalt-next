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
  Focus,
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
    <motion.div
      className="bg-gray-900 rounded-md border border-gray-700 p-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 hover:bg-gray-800/50"
          >
            <div className="flex items-center space-x-2">
              <Focus className="h-4 w-4" />
              <span className="text-sm font-medium">自动聚焦</span>
            </div>
            <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ type: "spring", stiffness: 300 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </Button>
        </CollapsibleTrigger>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CollapsibleContent className="p-2 space-y-3">
                {/* Focus Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* ...existing focus settings... */}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* ...existing action buttons... */}
                </div>
              </CollapsibleContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible>
    </motion.div>
  );
}
