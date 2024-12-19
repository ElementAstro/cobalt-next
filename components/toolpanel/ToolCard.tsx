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
  CustomComponent,
  viewMode = "grid",
}: ToolCardProps & { viewMode?: "grid" | "list" }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const cardClassName = {
    grid: "w-full",
    list: "w-full flex flex-row items-center",
  }[viewMode];

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
            <Card
              className={`${cardClassName} dark:bg-gray-800/90 hover:shadow-xl transition-all`}
            >
              <div
                className={
                  viewMode === "list"
                    ? "flex-1 flex items-center p-4 gap-4"
                    : ""
                }
              >
                <div className="relative">
                  <Icon className="h-6 w-6 text-primary" />
                  {usageCount > 10 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 text-xs"
                    >
                      常用
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                </div>

                {viewMode === "list" ? (
                  <div className="flex gap-2">
                    <Button onClick={() => onSelect(id)} size="sm">
                      使用
                    </Button>
                    <Button variant="outline" size="sm">
                      详情
                    </Button>
                  </div>
                ) : (
                  <CardFooter className="flex justify-between gap-2 pt-4">
                    <Button onClick={() => onSelect(id)} className="flex-1">
                      使用工具
                    </Button>
                    <Button variant="outline" className="w-24">
                      详情
                    </Button>
                  </CardFooter>
                )}
              </div>
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
