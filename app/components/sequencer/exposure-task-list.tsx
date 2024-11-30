"use client";

import { useState } from "react";
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

  const isMobile = useMediaQuery("(max-width: 768px)");

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: `Task ${tasks.length + 1}`,
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

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {isMobile ? (
                <div className="space-y-2">
                  {tasks.map((task, index) => (
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
                          className="bg-gray-800 p-2 rounded-lg flex items-center justify-between border border-gray-700"
                        >
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
                              className="bg-teal-500 text-white hover:bg-teal-600"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeTask(task.id)}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              X
                            </Button>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Total #</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Filter</TableHead>
                      <TableHead>Binning</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task, index) => (
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
                            <TableCell>{task.name}</TableCell>
                            <TableCell>
                              <Switch
                                checked={task.enabled}
                                onCheckedChange={(checked) =>
                                  updateTask({ ...task, enabled: checked })
                                }
                              />
                            </TableCell>
                            <TableCell>{task.progress.join(" / ")}</TableCell>
                            <TableCell>{task.total}</TableCell>
                            <TableCell>{task.time}</TableCell>
                            <TableCell>{task.type}</TableCell>
                            <TableCell>{task.filter}</TableCell>
                            <TableCell>{task.binning}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button onClick={() => editTask(task)}>
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeTask(task.id)}
                                >
                                  Remove
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

      <Button
        onClick={addTask}
        className="mt-4 w-full md:w-auto bg-teal-500 text-white hover:bg-teal-600"
      >
        Add Task
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={
            isMobile
              ? "w-full max-w-none m-0 p-4 bg-gray-900 text-white"
              : "bg-gray-900 text-white"
          }
        >
          <DialogHeader>
            <DialogTitle className="text-teal-500">Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
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
                <Label htmlFor="total">Total #</Label>
                <Input
                  id="total"
                  type="number"
                  value={editingTask.total}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      total: parseInt(e.target.value),
                    })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
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
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editingTask.type}
                  onValueChange={(value) =>
                    setEditingTask({ ...editingTask, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="LIGHT">LIGHT</SelectItem>
                    <SelectItem value="DARK">DARK</SelectItem>
                    <SelectItem value="FLAT">FLAT</SelectItem>
                    <SelectItem value="BIAS">BIAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter">Filter</Label>
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
                <Label htmlFor="binning">Binning</Label>
                <Input
                  id="binning"
                  value={editingTask.binning}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, binning: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button onClick={() => updateTask(editingTask)}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
