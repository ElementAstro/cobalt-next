"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: number;
  name: string;
  description: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ name: "", description: "" });

  const addTask = () => {
    if (newTask.name) {
      setTasks([...tasks, { id: Date.now(), ...newTask }]);
      setNewTask({ name: "", description: "" });
    }
  };

  const exportTasks = () => {
    const jsonString = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-name">Task Name</Label>
        <Input
          id="task-name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          placeholder="Enter task name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-description">Task Description</Label>
        <Textarea
          id="task-description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Enter task description"
        />
      </div>
      <Button onClick={addTask}>Add Task</Button>
      <ScrollArea className="h-[200px] border rounded-md p-4">
        {tasks.map((task) => (
          <div key={task.id} className="mb-4 p-2 border rounded">
            <h4 className="font-bold">{task.name}</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
        ))}
      </ScrollArea>
      <Button onClick={exportTasks}>Export Tasks as JSON</Button>
    </div>
  );
}
