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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="w-full sm:w-[300px] dark:bg-gray-800 hover:shadow-xl transition-all">
              <CardHeader className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {description}
                    </CardDescription>
                  </div>
                </motion.div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    使用次数: {usageCount}
                  </Badge>
                </div>
              </CardHeader>

              <CardFooter className="flex justify-between gap-2 pt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(id);
                  }}
                  className="flex-1"
                >
                  使用工具
                </Button>
                <Button variant="outline" className="w-24">
                  详情
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="dark:bg-gray-700">
          <p>点击使用 {name} 或拖动调整顺序</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
