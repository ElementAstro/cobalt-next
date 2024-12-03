"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Task, CoordinateData } from "@/types/sequencer";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash, Edit, Search } from "lucide-react";

interface TargetListProps {}

export function TargetList({}: TargetListProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTargetName, setNewTargetName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTarget = () => {
    if (newTargetName.trim()) {
      const newTarget: Target = {
        id: Date.now().toString(),
        name: newTargetName.trim(),
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
    setTargets(
      targets.map((target) => {
        if (target.id === targetId) {
          const newTask: Task = {
            id: Date.now().toString(),
            name: `任务 ${target.tasks.length + 1}`,
            duration: 60, // Default duration in seconds
          };
          return { ...target, tasks: [...target.tasks, newTask] };
        }
        return target;
      })
    );
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedTargets = Array.from(targets);
    const [movedTarget] = reorderedTargets.splice(result.source.index, 1);
    reorderedTargets.splice(result.destination.index, 0, movedTarget);

    setTargets(reorderedTargets);
  };

  const filteredTargets = targets.filter((target) =>
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="targets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Accordion type="single" collapsible className="w-full">
                {filteredTargets.map((target, index) => (
                  <Draggable
                    key={target.id}
                    draggableId={target.id}
                    index={index}
                  >
                    {(provided) => (
                      <AccordionItem
                        key={target.id}
                        value={target.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
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
                                onUpdateTasks={(updatedTasks) =>
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Accordion>
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
    </div>
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
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTasks: (tasks: Task[]) => void;
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

  const onDragEndTask = (result: any) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    onUpdateTasks(reorderedTasks);
  };

  return (
    <DragDropContext onDragEnd={onDragEndTask}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center justify-between bg-dark-700 p-2 rounded"
                  >
                    <div>
                      {task.name} - {task.duration}s
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const newName = prompt("输入新的任务名称", task.name);
                          const newDuration = Number(
                            prompt(
                              "输入新的持续时间（秒）",
                              task.duration.toString()
                            )
                          );
                          if (newName && !isNaN(newDuration)) {
                            editTask(task.id, newName, newDuration);
                          }
                        }}
                        className="bg-teal-500 text-white"
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 text-white"
                      >
                        删除
                      </Button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
