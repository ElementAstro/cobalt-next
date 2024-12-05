import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Todo } from "../../app/components/TodoList";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const categoryColors = {
    personal: "bg-purple-500",
    work: "bg-blue-500",
    study: "bg-indigo-500",
    astronomy: "bg-teal-500",
  };

  return (
    <li className="bg-card p-3 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`block ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.text}
          </label>
          <div className="flex space-x-2 mt-1">
            <Badge className={priorityColors[todo.priority]}>
              {todo.priority}
            </Badge>
            <Badge className={categoryColors[todo.category]}>
              {todo.category}
            </Badge>
            <Badge variant="outline">{todo.dueDate}</Badge>
            <Badge>{todo.celestialObject}</Badge> {/* 新增天体名称显示 */}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {/* 新增天文观测详情 */}
      {todo.celestialObject && (
        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="observationDetails">
            <AccordionTrigger>观测详情</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>观测地点:</strong> {todo.observationLocation}
                </p>
                <p>
                  <strong>天气状况:</strong> {todo.weatherConditions}
                </p>
                <p>
                  <strong>月相:</strong> {todo.moonPhase}
                </p>
                <p>
                  <strong>天体升起时间:</strong> {todo.celestialObjectRiseTime}
                </p>
                <p>
                  <strong>天体落下时间:</strong> {todo.celestialObjectSetTime}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </li>
  );
}
