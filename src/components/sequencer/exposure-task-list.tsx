"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion"; // Remove AnimatePresence
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle, Clock, Play } from "lucide-react"; // Remove Pause
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "react-responsive";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent, // Add DragEndEvent type
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "./sortable-item";
import { useSequencerStore } from "@/store/useSequencerStore";
import { ExposureTask, Task, TaskGroup } from "@/types/sequencer";
import { debounce } from "lodash";

interface TaskStatus {
  status: "pending" | "running" | "completed" | "failed";
  startTime?: Date;
  endTime?: Date;
  error?: string;
  notified?: boolean;
  progress: number;
}

interface TaskCardProps {
  task: ExposureTask; // 改为ExposureTask
  onEdit: (task: ExposureTask) => void;
  onDelete: (taskId: string) => void;
  updateTask?: (task: ExposureTask) => void;
  taskStatus?: Record<string, TaskStatus>;
}

interface TaskEditFormProps {
  task: ExposureTask;
  onSave: (task: ExposureTask) => void;
  onCancel: () => void;
}

interface ExposureTaskListProps {
  groups?: TaskGroup[];
  onGroupsChange?: (groups: TaskGroup[]) => void;
}

export function ExposureTaskList({
  groups = [],
  onGroupsChange,
}: ExposureTaskListProps) {
  const { targets, activeTargetId, updateTarget, updateTaskStatus } =
    useSequencerStore();

  // Retrieve the active target and its tasks
  const target = targets.find((t) => t.id === activeTargetId);
  const [tasks, setTasks] = useState<ExposureTask[]>(target ? target.tasks : []);

  // Helper to update tasks of the active target
  const updateTasks = (newTasks: ExposureTask[]) => {
    if (activeTargetId && target) {
      updateTarget(activeTargetId, { ...target, tasks: newTasks });
    }
  };

  const handleTaskStatusUpdate = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

  const handleAddTask = () => {
    if (activeTargetId) {
      const newTask: ExposureTask = {
        id: Date.now().toString(),
        name: `任务 ${tasks.length + 1}`,
        enabled: true,
        progress: [0, 1],
        total: 1,
        time: "1s",
        type: "LIGHT",
        filter: "",
        binning: "1x1",
        duration: 0,
        count: 1,
        category: "",
        metadata: {
          camera: "",
          filter: "",
          exposure: 0,
          gain: 0,
          binning: "1x1",
          temperature: -10,
        },
        status: {
          state: "pending",
          progress: 0,
          attempts: 0,
          logs: [],
        },
        settings: {
          dither: false,
          ditherScale: 1,
          focusCheck: false,
          meridianFlip: false,
          autoGuide: false,
          delay: 0,
          repeat: 1,
        },
      };
      updateTasks([...tasks, newTask]);
    }
  };

  const [editingTask, setEditingTask] = useState<ExposureTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType !== "ALL" ? task.type === selectedType : true)
    );
  }, [tasks, searchTerm, selectedType]);

  const updateTask = (updatedTask: ExposureTask) => {
    const isCompleted = updatedTask.progress[0] === updatedTask.progress[1];
    const prevTask = tasks.find((t) => t.id === updatedTask.id);
    const wasCompleted = prevTask
      ? prevTask.progress[0] === prevTask.progress[1]
      : false;

    updateTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    if (isCompleted && !wasCompleted) {
      setTaskStatus((prev) => ({
        ...prev,
        [updatedTask.id]: {
          ...prev[updatedTask.id],
          status: "completed",
          endTime: new Date(),
          notified: false,
          progress: 100,
        },
      }));
    }

    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const removeTask = (taskId: string) => {
    updateTasks(tasks.filter((task) => task.id !== taskId));
  };

  const editTask = (task: ExposureTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleBatchDelete = () => {
    updateTasks(tasks.filter((task) => !task.enabled));
  };

  // 添加新的状态和功能
  const [taskStatus, setTaskStatus] = useState<
    Record<
      string,
      {
        status: "pending" | "running" | "completed" | "failed";
        startTime?: Date;
        endTime?: Date;
        error?: string;
        notified?: boolean;
        progress: number;
      }
    >
  >({});

  useEffect(() => {
    const completedTasks = Object.entries(taskStatus).filter(
      ([, status]) => status.status === "completed" && !status.notified
    );

    if (completedTasks.length > 0) {
      completedTasks.forEach(([taskId]) => {
        // 更新通知状态
        setTaskStatus((prev) => ({
          ...prev,
          [taskId]: {
            ...prev[taskId],
            notified: true,
          },
        }));

        // 播放提示音
        new Audio("/sounds/task-completed.mp3").play().catch(() => {});
      });
    }
  }, [taskStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const [bulkActions, setBulkActions] = useState({
    selectedTasks: new Set<string>(),
    isSelectAll: false,
  });

  const handleBulkAction = (action: "enable" | "disable" | "delete") => {
    const selectedIds = Array.from(bulkActions.selectedTasks);
    switch (action) {
      case "enable":
      case "disable":
        updateTasks(
          tasks.map((task) =>
            selectedIds.includes(task.id)
              ? { ...task, enabled: action === "enable" }
              : task
          )
        );
        break;
      case "delete":
        updateTasks(tasks.filter((task) => !selectedIds.includes(task.id)));
        break;
    }
    setBulkActions({ selectedTasks: new Set(), isSelectAll: false });
  };

  // 添加批量操作和分组功能
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [groupingMode, setGroupingMode] = useState<
    "none" | "type" | "filter" | "custom"
  >("none");

  const handleTaskSelection = (taskId: string, selected: boolean) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(taskId);
      } else {
        next.delete(taskId);
      }
      return next;
    });
  };

  const createTaskGroup = (name: string, taskIds: string[]) => {
    const newGroup: TaskGroup = {
      id: crypto.randomUUID(),
      name,
      tasks: tasks.filter((t) => taskIds.includes(t.id)) as ExposureTask[],
      status: "pending",
      progress: 0,
      settings: {
        concurrent: false,
        maxRetries: 3,
        timeout: 300,
      },
    };
    onGroupsChange?.([...groups, newGroup]);
  };

  // 添加性能优化
  const debouncedUpdateTasks = useMemo(
    () =>
      debounce((newTasks: ExposureTask[]) => {
        updateTasks(newTasks);
      }, 300),
    [updateTasks]
  );

  // 添加键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedTasks.size > 0) {
        updateTasks(tasks.filter((task) => !selectedTasks.has(task.id)));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedTasks, tasks, updateTasks]);

  // 添加拖拽排序的优化
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      setTasks((prev) => {
        const next = arrayMove(prev, oldIndex, newIndex);
        debouncedUpdateTasks(next);
        return next;
      });
    }
  };

  // 添加任务状态监控
  useEffect(() => {
    const interval = setInterval(() => {
      const runningTasks = tasks.filter(
        (task) => taskStatus[task.id]?.status === "running"
      );

      runningTasks.forEach((task) => {
        // 更新进度
        updateTaskStatus(task.id, {
          ...taskStatus[task.id],
          progress: Math.min(
            taskStatus[task.id].progress + Math.random() * 5,
            100
          ),
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, taskStatus, updateTaskStatus]);

  return (
    <div className="p-2 space-y-2">
      {/* Add new group controls */}
      <div className="flex justify-between items-center">
        <Select
          value={groupingMode}
          onValueChange={setGroupingMode as (value: string) => void}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择分组方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">不分组</SelectItem>
            <SelectItem value="type">按类型分组</SelectItem>
            <SelectItem value="filter">按滤镜分组</SelectItem>
            <SelectItem value="custom">自定义分组</SelectItem>
          </SelectContent>
        </Select>

        {selectedTasks.size > 0 && (
          <Button
            onClick={() => {
              const name = prompt("输入分组名称");
              if (name) {
                createTaskGroup(name, Array.from(selectedTasks));
                setSelectedTasks(new Set());
              }
            }}
          >
            创建分组
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 bg-gray-800/50"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-40 bg-gray-800/50">
              <SelectValue placeholder="筛选类型" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="LIGHT">LIGHT</SelectItem>
              <SelectItem value="DARK">DARK</SelectItem>
              <SelectItem value="FLAT">FLAT</SelectItem>
              <SelectItem value="BIAS">BIAS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleBatchDelete}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-700"
          >
            批量删除
          </Button>
          <Button
            onClick={handleAddTask}
            className="bg-teal-500 hover:bg-teal-600"
          >
            添加任务
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            onClick={() => handleBulkAction("enable")}
            disabled={bulkActions.selectedTasks.size === 0}
          >
            批量启用
          </Button>
          <Button
            onClick={() => handleBulkAction("disable")}
            disabled={bulkActions.selectedTasks.size === 0}
          >
            批量禁用
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleBulkAction("delete")}
            disabled={bulkActions.selectedTasks.size === 0}
          >
            批量删除
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={filteredTasks}
          strategy={verticalListSortingStrategy}
        >
          {isMobile ? (
            <div className="grid gap-2">
              {filteredTasks.map((task) => (
                <SortableItem key={task.id} task={task}>
                  <TaskCard
                    task={task}
                    onEdit={editTask}
                    onDelete={removeTask}
                  />
                </SortableItem>
              ))}
            </div>
          ) : (
            <div className="rounded-md overflow-hidden border border-gray-700">
              <Table>
                <TableHeader className="bg-gray-900/50">
                  <TableRow>
                    <TableHead>
                      <Switch
                        checked={tasks.every((task) => task.enabled)}
                        onCheckedChange={(checked) =>
                          updateTasks(
                            tasks.map((task) => ({
                              ...task,
                              enabled: checked,
                            }))
                          )
                        }
                      />
                    </TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>总数</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>进度</TableHead>
                    <TableHead>筛选</TableHead>
                    <TableHead>分辨率</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-gray-800/30">
                  {filteredTasks.map((task) => (
                    <SortableItem key={task.id} task={task}>
                      <TableRow
                        className={
                          taskStatus[task.id]?.status === "completed"
                            ? "bg-green-900/10"
                            : ""
                        }
                      >
                        <TableCell>
                          <Switch
                            checked={task.enabled}
                            onCheckedChange={(checked) =>
                              updateTask({ ...task, enabled: checked })
                            }
                          />
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          {task.name}
                          {getStatusIcon(taskStatus[task.id]?.status)}
                        </TableCell>
                        <TableCell>{task.type}</TableCell>
                        <TableCell>{task.total}</TableCell>
                        <TableCell>{task.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                (task.progress[0] / task.progress[1]) * 100
                              }
                              className="h-2 w-24"
                            />
                            <span className="text-sm">
                              {task.progress.join(" / ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{task.filter}</TableCell>
                        <TableCell>{task.binning}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => editTask(task)}
                              className="bg-teal-500 text-white"
                            >
                              编辑
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeTask(task.id)}
                              className="bg-red-500 text-white"
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </SortableItem>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SortableContext>
      </DndContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>编辑任务</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskEditForm
              task={editingTask}
              onSave={updateTask}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Updated TaskCard component with proper types
function TaskCard({
  task,
  onEdit,
  onDelete,
  updateTask,
  taskStatus,
}: TaskCardProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            checked={task.enabled}
            onCheckedChange={(checked) =>
              updateTask?.({ ...task, enabled: checked })
            }
            className="data-[state=checked]:bg-teal-500"
          />
          <span className="text-sm text-white flex items-center gap-1">
            {task.name}
            {taskStatus && getStatusIcon(taskStatus[task.id]?.status)}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            onClick={() => onEdit(task)}
            className="bg-teal-500 text-white"
          >
            编辑
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(task.id)}
            className="bg-red-500 text-white"
          >
            删除
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        类型: {task.type} | 总数: {task.total} | 时间: {task.time}
      </div>
      <div className="flex items-center space-x-2">
        <Progress
          value={(task.progress[0] / task.progress[1]) * 100}
          className="h-2 w-full"
        />
        <span className="text-sm">{task.progress.join(" / ")}</span>
      </div>
    </motion.div>
  );
}

// Updated TaskEditForm component with proper types
function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [editingTask, setEditingTask] = useState<ExposureTask>({
    ...task,
    category: task.category || "default",
    metadata: {
      ...task.metadata, // Spread first
      // Only set defaults for missing values
      camera: task.metadata?.camera || "",
      filter: task.metadata?.filter || "",
      exposure: task.metadata?.exposure || 0,
      gain: task.metadata?.gain || 0,
      binning: task.metadata?.binning || "1x1",
      temperature: task.metadata?.temperature || -10,
    },
    status: {
      ...task.status, // Spread first
      // Only set defaults for missing values
      state: task.status?.state || "pending",
      progress: task.status?.progress || 0,
      attempts: task.status?.attempts || 0,
      logs: task.status?.logs || [],
    },
    settings: {
      ...task.settings,
      dither: task.settings?.dither || false,
      ditherScale: task.settings?.ditherScale || 1,
      focusCheck: task.settings?.focusCheck || false,
      meridianFlip: task.settings?.meridianFlip || false,
      autoGuide: task.settings?.autoGuide || false,
      delay: task.settings?.delay || 0,
      repeat: task.settings?.repeat || 1,
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">名称</Label>
        <Input
          id="name"
          value={editingTask.name}
          onChange={(e) =>
            setEditingTask({ ...editingTask, name: e.target.value })
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="type">类型</Label>
        <Select
          value={editingTask.type}
          onValueChange={(value) =>
            setEditingTask({ ...editingTask, type: value })
          }
        >
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LIGHT">LIGHT</SelectItem>
            <SelectItem value="DARK">DARK</SelectItem>
            <SelectItem value="FLAT">FLAT</SelectItem>
            <SelectItem value="BIAS">BIAS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="total">总数</Label>
        <Input
          id="total"
          type="number"
          value={editingTask.total}
          onChange={(e) =>
            setEditingTask({
              ...editingTask,
              total: parseInt(e.target.value) || 0,
            })
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="time">时间</Label>
        <Input
          id="time"
          value={editingTask.time}
          onChange={(e) =>
            setEditingTask({ ...editingTask, time: e.target.value })
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="filter">筛选</Label>
        <Input
          id="filter"
          value={editingTask.filter}
          onChange={(e) =>
            setEditingTask({ ...editingTask, filter: e.target.value })
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="binning">分辨率</Label>
        <Input
          id="binning"
          value={editingTask.binning}
          onChange={(e) =>
            setEditingTask({ ...editingTask, binning: e.target.value })
          }
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => onSave(editingTask)}
          className="bg-teal-500 text-white"
        >
          保存更改
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-gray-800 border-gray-700 text-white"
        >
          取消
        </Button>
      </div>
    </div>
  );
}
