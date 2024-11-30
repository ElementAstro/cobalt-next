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

export function TargetList() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTargetName, setNewTargetName] = useState("");

  const addTarget = () => {
    if (newTargetName) {
      const newTarget: Target = {
        id: Date.now().toString(),
        name: newTargetName,
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

  const addTask = (targetId: string) => {
    setTargets(
      targets.map((target) => {
        if (target.id === targetId) {
          const newTask: Task = {
            id: Date.now().toString(),
            name: `Task ${target.tasks.length + 1}`,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={newTargetName}
          onChange={(e) => setNewTargetName(e.target.value)}
          placeholder="Enter target name"
        />
        <Button onClick={addTarget}>Add Target</Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {targets.map((target) => (
          <AccordionItem key={target.id} value={target.id}>
            <AccordionTrigger>{target.name}</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <CardTitle>Coordinates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>RA</Label>
                      <Input
                        type="number"
                        value={target.coordinates.ra.h}
                        onChange={(e) =>
                          updateCoordinates(target.id, {
                            ...target.coordinates,
                            ra: {
                              ...target.coordinates.ra,
                              h: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Dec</Label>
                      <Input
                        type="number"
                        value={target.coordinates.dec.d}
                        onChange={(e) =>
                          updateCoordinates(target.id, {
                            ...target.coordinates,
                            dec: {
                              ...target.coordinates.dec,
                              d: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Rotation</Label>
                      <Input
                        type="number"
                        value={target.coordinates.rotation}
                        onChange={(e) =>
                          updateCoordinates(target.id, {
                            ...target.coordinates,
                            rotation: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {target.tasks.map((task) => (
                      <li key={task.id}>
                        {task.name} - {task.duration}s
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => addTask(target.id)} className="mt-2">
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
