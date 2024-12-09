"use client";

import { useState, useMemo } from "react";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Search } from "lucide-react";

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

interface ExposureTaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function ExposureTaskList({
  tasks,
  onTasksChange,
}: ExposureTaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedType !== "ALL" ? task.type === selectedType : true)
    );
  }, [tasks, searchTerm, selectedType]);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: `任务 ${tasks.length + 1}`,
      enabled: true,
      progress: [0, 1],
      total: 1,
      time: "1s",
      type: "LIGHT",
      filter: "",
      binning: "1x1",
    };
    onTasksChange([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    onTasksChange(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const removeTask = (taskId: string) => {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    onTasksChange(newTasks);
  };

  const handleBatchDelete = () => {
    const selectedIds = tasks
      .filter((task) => task.enabled)
      .map((task) => task.id);
    onTasksChange(tasks.filter((task) => !selectedIds.includes(task.id)));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="筛选类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部</SelectItem>
              <SelectItem value="LIGHT">LIGHT</SelectItem>
              <SelectItem value="DARK">DARK</SelectItem>
              <SelectItem value="FLAT">FLAT</SelectItem>
              <SelectItem value="BIAS">BIAS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="destructive" onClick={handleBatchDelete}>
            批量删除
          </Button>
          <Button onClick={addTask} className="bg-teal-500 text-white">
            添加任务
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {isMobile ? (
                <div className="space-y-2">
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-800 p-4 rounded-lg flex flex-col space-y-2 border border-gray-700"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={task.enabled}
                                onCheckedChange={(checked) =>
                                  updateTask({ ...task, enabled: checked })
                                }
                                className="data-[state=checked]:bg-teal-500"
                              />
                              <span className="text-sm text-white">
                                {task.name}
                              </span>
                            </div>
                            <div className="flex space-x-1">
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
                          </div>
                          <div className="text-sm text-gray-400">
                            类型: {task.type} | 总数: {task.total} | 时间:{" "}
                            {task.time}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Switch
                          checked={tasks.every((task) => task.enabled)}
                          onCheckedChange={(checked) =>
                            onTasksChange(
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
                  <TableBody>
                    {filteredTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>
                              <Switch
                                checked={task.enabled}
                                onCheckedChange={(checked) =>
                                  updateTask({ ...task, enabled: checked })
                                }
                              />
                            </TableCell>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>{task.type}</TableCell>
                            <TableCell>{task.total}</TableCell>
                            <TableCell>{task.time}</TableCell>
                            <TableCell>{task.progress.join(" / ")}</TableCell>
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
                        )}
                      </Draggable>
                    ))}
                  </TableBody>
                </Table>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={
            isMobile
              ? "w-full max-w-none m-0 p-4 bg-gray-900 text-white"
              : "bg-gray-900 text-white"
          }
        >
          <DialogHeader>
            <DialogTitle className="text-teal-500">编辑任务</DialogTitle>
          </DialogHeader>
          {editingTask && (
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
              <Button
                onClick={() => updateTask(editingTask)}
                className="bg-teal-500 text-white"
              >
                保存更改
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}