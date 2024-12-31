import React, { useState, memo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  GripVertical,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface JsonNodeProps {
  data: any;
  path: string[];
  onchange: (path: string[], value: any) => void;
  ondelete: (path: string[]) => void;
  onAddChild: (path: string[]) => void;
  index?: number;
  schema?: any;
  validate?: (path: string[], value: any) => string | null;
}

function SortableNode({
  id,
  data,
  path,
  onchange,
  ondelete,
  onAddChild,
  validate,
}: JsonNodeProps & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <JsonNode
        data={data}
        path={path}
        onchange={onchange}
        ondelete={ondelete}
        onAddChild={onAddChild}
        validate={validate}
      />
    </div>
  );
}

const JsonNode = memo(function JsonNode({
  data,
  path,
  onchange,
  ondelete,
  onAddChild,
  index,
  validate,
}: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const nodeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: -20 },
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = Object.keys(data).indexOf(active.id);
      const newIndex = Object.keys(data).indexOf(over.id);
      const newData = arrayMove(Object.entries(data), oldIndex, newIndex);
      onchange(path, Object.fromEntries(newData));
    }
  };

  const renderValue = (value: any) => {
    const error = validate?.(path, value);

    if (error) {
      return <div className="ml-2 text-red-500 text-sm">{error}</div>;
    }

    // Handle date type
    if (value instanceof Date) {
      return (
        <input
          type="date"
          value={value.toISOString().split("T")[0]}
          onChange={(e) => onchange(path, new Date(e.target.value))}
          className="ml-2 p-1 border rounded"
        />
      );
    }

    // Handle color type
    if (typeof value === "string" && /^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      return (
        <input
          type="color"
          value={value}
          onChange={(e) => onchange(path, e.target.value)}
          className="ml-2 h-8 w-8"
        />
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={Object.keys(value)}
            strategy={verticalListSortingStrategy}
          >
            <div className="pl-4">
              {Object.entries(value).map(([key, val]) => (
                <SortableNode
                  key={key}
                  id={key}
                  data={val}
                  path={[...path, key]}
                  onchange={onchange}
                  ondelete={ondelete}
                  onAddChild={onAddChild}
                  validate={validate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
    } else {
      return (
        <div className="ml-2 w-full md:w-auto">
          <Input
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              const error = validate?.(path, newValue);
              if (!error) {
                onchange(path, newValue);
              }
            }}
          />
          {validate?.(path, value) && (
            <div className="text-red-500 text-xs mt-1">
              {validate(path, value)}
            </div>
          )}
        </div>
      );
    }
  };

  const nodeContent = (
    <motion.div
      variants={nodeVariants}
      className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-accent/10 group"
    >
      {typeof data === "object" && data !== null && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="h-8 w-8 p-0 hover:bg-transparent"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </Button>
      )}

      <span className="font-medium text-sm">
        {path[path.length - 1] || "root"}:
      </span>

      {typeof data !== "object" && (
        <div className="flex-1 max-w-md">
          <Input
            value={data}
            onChange={(e) => onchange(path, e.target.value)}
            className="h-8 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      <Badge variant="secondary" className="h-6 px-2 text-xs">
        {typeof data}
      </Badge>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => ondelete(path)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {typeof data === "object" && data !== null && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild(path)}
            className="h-8 w-8 p-0 text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={nodeVariants}
      className="my-2 border border-border rounded-lg p-2 bg-card shadow-sm"
    >
      {nodeContent}
      {isExpanded &&
        typeof data === "object" &&
        data !== null &&
        renderValue(data)}
    </motion.div>
  );
});

export default JsonNode;
