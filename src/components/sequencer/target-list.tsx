"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Task, CoordinateData, ExposureTask } from "@/types/sequencer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash, Edit, Search, Plus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

interface TargetListProps {}

export function TargetList({}: TargetListProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTargetName, setNewTargetName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = [
    { value: "all", label: "全部" },
    { value: "star", label: "恒星" },
    { value: "galaxy", label: "星系" },
    { value: "nebula", label: "星云" },
    { value: "planet", label: "行星" },
  ];
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ExposureTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTarget = () => {
    if (newTargetName.trim()) {
      const newTarget: Target = {
        id: Date.now().toString(),
        name: newTargetName.trim(),
        category: selectedCategory,
        coordinates: {
          ra: { h: 0, m: 0, s: 0 },
          dec: { d: 0, m: 0, s: 0 },
          rotation: 0,
        },
        tasks: [],
      };
      setTargets([...targets, newTarget]);
      setNewTargetName("");
    }
  };

  const deleteTarget = (targetId: string) => {
    setTargets(targets.filter((target) => target.id !== targetId));
  };

  const addTask = (targetId: string) => {
    const target = targets.find((t) => t.id === targetId);
    const taskCount = (target?.tasks.length || 0) + 1;
    const newTask: ExposureTask = {
      id: Date.now().toString(),
      name: `任务 ${taskCount}`,
      duration: 60,
      type: "imaging",
      filter: "L",
      binning: "1x1",
      count: 1,
      category: "imaging",
      enabled: true,
      total: 0,
      time: "",
      progress: [0, 0],
      metadata: {
        camera: "",
        filter: "",
        exposure: 0,
        gain: 0,
        binning: "",
        temperature: 0,
      },
      status: {
        state: "pending",
        progress: 0,
        attempts: 0,
        logs: [],
      },
      settings: {
        dither: false,
        ditherScale: 0,
        focusCheck: false,
        meridianFlip: false,
        autoGuide: false,
        delay: 0,
        repeat: 0,
      },
    };
    setEditingTask(newTask);
    setIsTaskDialogOpen(true);
  };

  const updateCoordinates = (targetId: string, coordinates: CoordinateData) => {
    setTargets(
      targets.map((target) =>
        target.id === targetId ? { ...target, coordinates } : target
      )
    );
  };

  const editTarget = (target: Target) => {
    setEditingTarget(target);
    setIsDialogOpen(true);
  };

  const updateTarget = (updatedTarget: Target) => {
    setTargets(
      targets.map((target) =>
        target.id === updatedTarget.id ? updatedTarget : target
      )
    );
    setEditingTarget(null);
    setIsDialogOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = targets.findIndex((target) => target.id === active.id);
      const newIndex = targets.findIndex((target) => target.id === over?.id);
      setTargets((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const filteredTargets = targets.filter((target) =>
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-4 bg-gray-900 rounded-md text-white">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索目标..."
              className="w-48"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={newTargetName}
              onChange={(e) => setNewTargetName(e.target.value)}
              placeholder="输入目标名称"
              className="bg-dark-700 text-dark-200"
            />
            <Button onClick={addTarget} className="bg-dark-500 text-dark-200">
              添加目标
            </Button>
          </div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTargets.map((target) => target.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion type="single" collapsible className="w-full">
              {filteredTargets.map((target) => (
                <SortableItem
                  key={target.id}
                  task={{
                    id: target.id,
                    name: target.name,
                    enabled: true,
                    progress: [0, 0],
                    total: 0,
                    time: "",
                    type: "",
                    filter: "",
                    binning: "",
                    duration: 0,
                    count: 1,
                    category: "imaging",
                    metadata: {
                      camera: "",
                      filter: "",
                      exposure: 0,
                      gain: 0,
                      binning: "",
                      temperature: 0,
                    },
                    status: {
                      state: "pending",
                      progress: 0,
                      attempts: 0,
                      logs: [],
                    },
                    settings: {
                      dither: false,
                      ditherScale: 0,
                      focusCheck: false,
                      meridianFlip: false,
                      autoGuide: false,
                      delay: 0,
                      repeat: 0,
                    },
                  }}
                >
                  <AccordionItem value={target.id}>
                    <AccordionTrigger className="bg-dark-700 text-dark-200 flex justify-between items-center">
                      {target.name}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editTarget(target);
                          }}
                          className="bg-teal-500 text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTarget(target.id);
                          }}
                          className="bg-red-500 text-white"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-dark-800 text-dark-200">
                      <Card className="bg-dark-800 text-dark-200">
                        <CardHeader>
                          <CardTitle>坐标</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <CoordinateInput
                              label="RA"
                              value={target.coordinates.ra}
                              onChange={(ra) =>
                                updateCoordinates(target.id, {
                                  ...target.coordinates,
                                  ra,
                                })
                              }
                            />
                            <CoordinateInput
                              label="Dec"
                              value={target.coordinates.dec}
                              onChange={(dec) =>
                                updateCoordinates(target.id, {
                                  ...target.coordinates,
                                  dec,
                                })
                              }
                            />
                            <div>
                              <Label className="text-dark-400">旋转</Label>
                              <Input
                                type="number"
                                value={target.coordinates.rotation}
                                onChange={(e) =>
                                  updateCoordinates(target.id, {
                                    ...target.coordinates,
                                    rotation: Number(e.target.value),
                                  })
                                }
                                className="bg-dark-700 text-dark-200"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="mt-4 bg-dark-800 text-dark-200">
                        <CardHeader>
                          <CardTitle>任务</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TaskList
                            tasks={target.tasks}
                            onAddTask={() => addTask(target.id)}
                            onUpdateTasks={(updatedTasks: ExposureTask[]) =>
                              setTargets(
                                targets.map((t) =>
                                  t.id === target.id
                                    ? { ...t, tasks: updatedTasks }
                                    : t
                                )
                              )
                            }
                          />
                          <Button
                            onClick={() => addTask(target.id)}
                            className="mt-2 bg-dark-500 text-dark-200"
                          >
                            添加任务
                          </Button>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </SortableItem>
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>

        {/* 编辑目标对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-dark-800 text-dark-200">
            <DialogHeader>
              <DialogTitle>编辑目标</DialogTitle>
            </DialogHeader>
            {editingTarget && (
              <div className="space-y-4">
                <Input
                  value={editingTarget.name}
                  onChange={(e) =>
                    setEditingTarget({ ...editingTarget, name: e.target.value })
                  }
                  placeholder="目标名称"
                  className="bg-dark-700 text-dark-200"
                />
                <Button
                  onClick={() => updateTarget(editingTarget)}
                  className="bg-teal-500 text-white"
                >
                  保存
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 编辑任务对话框 */}
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="bg-dark-800 text-dark-200">
            <DialogHeader>
              <DialogTitle>编辑任务</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <Input
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, name: e.target.value })
                  }
                  placeholder="任务名称"
                  className="bg-dark-700 text-dark-200"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>类型</Label>
                    <Select
                      value={editingTask.type}
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, type: value })
                      }
                    >
                      <SelectTrigger className="bg-dark-700 text-dark-200">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imaging">成像</SelectItem>
                        <SelectItem value="calibration">校准</SelectItem>
                        <SelectItem value="focus">对焦</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>滤镜</Label>
                    <Select
                      value={editingTask.filter}
                      onValueChange={(value) =>
                        setEditingTask({ ...editingTask, filter: value })
                      }
                    >
                      <SelectTrigger className="bg-dark-700 text-dark-200">
                        <SelectValue placeholder="选择滤镜" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="R">R</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (editingTask) {
                      const target = targets.find(
                        (t) => t.id === editingTarget?.id
                      );
                      if (target) {
                        setTargets(
                          targets.map((t) =>
                            t.id === target.id
                              ? { ...t, tasks: [...t.tasks, editingTask] }
                              : t
                          )
                        );
                      }
                    }
                    setIsTaskDialogOpen(false);
                  }}
                  className="bg-teal-500 text-white"
                >
                  保存
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}

interface CoordinateInputProps {
  label: string;
  value: {
    h?: number;
    m?: number;
    s?: number;
    d?: number;
  };
  onChange: (value: any) => void;
}

function CoordinateInput({ label, value, onChange }: CoordinateInputProps) {
  return (
    <div>
      <Label className="text-dark-400">{label}</Label>
      <div className="flex space-x-2">
        <Input
          type="number"
          value={value.h || value.d || 0}
          onChange={(e) =>
            onChange({
              ...value,
              h: label === "RA" ? Number(e.target.value) : value.h,
              d: label === "Dec" ? Number(e.target.value) : value.d,
            })
          }
          className="w-16 bg-dark-700 text-dark-200"
          placeholder={label === "RA" ? "小时" : "度"}
        />
        <Input
          type="number"
          value={value.m || 0}
          onChange={(e) =>
            onChange({
              ...value,
              m: Number(e.target.value),
            })
          }
          className="w-16 bg-dark-700 text-dark-200"
          placeholder="分"
        />
        <Input
          type="number"
          value={value.s || 0}
          onChange={(e) =>
            onChange({
              ...value,
              s: Number(e.target.value),
            })
          }
          className="w-16 bg-dark-700 text-dark-200"
          placeholder="秒"
        />
      </div>
    </div>
  );
}

interface TaskListProps {
  tasks: ExposureTask[];
  onAddTask: () => void;
  onUpdateTasks: (tasks: ExposureTask[]) => void;
}

function TaskList({ tasks, onAddTask, onUpdateTasks }: TaskListProps) {
  const editTask = (taskId: string, newName: string, newDuration: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, name: newName, duration: newDuration }
        : task
    );
    onUpdateTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    onUpdateTasks(updatedTasks);
  };

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-col bg-gray-800/50 p-3 rounded-lg border border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={task.enabled}
                onCheckedChange={(checked) => {
                  const updatedTasks = tasks.map((t) =>
                    t.id === task.id ? { ...t, enabled: checked } : t
                  );
                  onUpdateTasks(updatedTasks);
                }}
              />
              <span className="text-sm font-medium">{task.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const newName = prompt("输入新的任务名称", task.name);
                  const newDuration = Number(
                    prompt("输入新的持续时间（秒）", task.duration.toString())
                  );
                  if (newName && !isNaN(newDuration)) {
                    editTask(task.id, newName, newDuration);
                  }
                }}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteTask(task.id)}
                className="h-8 px-2"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
            <div>
              <span>总数: </span>
              <span className="text-white">{task.total}</span>
            </div>
            <div>
              <span>时间: </span>
              <span className="text-white">{task.time}</span>
            </div>
            <div>
              <span>进度: </span>
              <span className="text-white">{task.progress.join("/")}</span>
            </div>
          </div>

          <div className="mt-2">
            <Progress
              value={(task.progress[0] / task.progress[1]) * 100}
              className="h-1"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
