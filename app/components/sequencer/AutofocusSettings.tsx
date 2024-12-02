"use client";

import { useState, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ExposureTaskList } from "./ExposureTaskList";
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

  const isMobile = useMediaQuery("(max-width: 768px)");

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
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap space-x-2 overflow-x-auto pb-2">
              {targets.map((target) => (
                <div key={target.id} className="flex items-center space-x-1">
                  <Button
                    variant={
                      target.id === activeTargetId ? "default" : "outline"
                    }
                    onClick={() => setActiveTargetId(target.id)}
                    className="whitespace-nowrap bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                  >
                    {target.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTarget(target.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
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
              <label className="bg-teal-500 text-white hover:bg-teal-600 flex items-center cursor-pointer px-3">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={importJson}
                />
              </label>
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
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}
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
              <input
                type="number"
                value={ditherEvery ?? ""}
                onChange={(e) =>
                  setDitherEvery(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full p-2 bg-gray-800 text-white rounded"
                placeholder="Enter number"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400">Gain</Label>
              <input
                type="text"
                value={gain}
                onChange={(e) => setGain(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                placeholder="Gain value"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400">Offset</Label>
              <input
                type="text"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                placeholder="Offset value"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
