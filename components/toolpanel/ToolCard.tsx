import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TypeIcon as type, LucideIcon, GripVertical } from "lucide-react";
import { ToolCardProps } from "@/types/toolpanel";
import { motion } from "framer-motion";

export function ToolCard({
  id,
  name,
  description,
  icon: Icon,
  usageCount,
  category,
  onSelect,
  CustomComponent, // 新增自定义组件属性
}: ToolCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
              className="absolute top-0 right-0 p-2 cursor-move"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Card className="w-full sm:w-[300px] hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className="h-6 w-6" />
                  <CardTitle>{name}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <div className="flex space-x-2 w-full">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(id);
                    }}
                    className="flex-1"
                  >
                    使用工具
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 跳转到详情页的逻辑
                    }}
                  >
                    详情
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>点击使用 {name} 或拖动图标调整顺序</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
