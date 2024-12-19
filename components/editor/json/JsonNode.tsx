import React, { useState, memo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  GripVertical,
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
}

const JsonNode = memo(function JsonNode({
  data,
  path,
  onchange,
  ondelete,
  onAddChild,
  index,
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

  const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return (
        <Droppable droppableId={path.join(",")}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="pl-4"
            >
              {Object.entries(value).map(([key, val], idx) => (
                <JsonNode
                  key={key}
                  data={val}
                  path={[...path, key]}
                  onchange={onchange}
                  ondelete={ondelete}
                  onAddChild={onAddChild}
                  index={idx}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => onchange(path, e.target.value)}
          className="ml-2 w-full md:w-auto"
        />
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

  if (index !== undefined) {
    return (
      <Draggable draggableId={path.join(",")} index={index}>
        {(provided) => (
          <motion.div
            variants={nodeVariants}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="my-2 border border-gray-200 rounded p-2"
          >
            <div className="flex items-center">
              <div {...provided.dragHandleProps} className="mr-2">
                <GripVertical className="h-4 w-4" />
              </div>
              {nodeContent}
            </div>
            {isExpanded &&
              typeof data === "object" &&
              data !== null &&
              renderValue(data)}
          </motion.div>
        )}
      </Draggable>
    );
  }

  return (
    <motion.div
      variants={nodeVariants}
      className="my-2 border border-border rounded-lg p-2 bg-card"
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
