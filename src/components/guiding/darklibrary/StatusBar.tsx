import { DarkFieldProgress } from "@/types/guiding/darkfield";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  isLoading: boolean;
  progress: DarkFieldProgress;
  stage: DarkFieldProgress["stage"];
  warnings: string[];
}

export function StatusBar({
  isLoading,
  progress,
  stage,
  warnings,
}: StatusBarProps) {
  if (!isLoading) return null;

  const stageText = {
    preparing: "准备中",
    capturing: "拍摄中",
    processing: "处理中",
    saving: "保存中",
    error: "错误",
    completed: "完成",
    cancelled: "已取消",
    paused: "已暂停",
  };

  const progressVariants = {
    initial: { scaleX: 0 },
    animate: { 
      scaleX: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const stageColors = {
    preparing: "bg-blue-500",
    capturing: "bg-green-500",
    processing: "bg-yellow-500",
    saving: "bg-purple-500",
    error: "bg-red-500",
    completed: "bg-emerald-500",
    cancelled: "bg-gray-500",
    paused: "bg-orange-500"
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="bg-background/95 backdrop-blur-md border-b shadow-lg">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <Badge 
                variant="outline" 
                className={cn("capitalize", stageColors[stage])}
              >
                {stageText[stage]}
              </Badge>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  进度: {progress.currentFrame} / {progress.totalFrames}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round((progress.currentFrame / progress.totalFrames) * 100)}%
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative h-1 mt-4 bg-muted rounded-full overflow-hidden"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className={cn("absolute h-full", stageColors[stage])}
              style={{ 
                width: `${(progress.currentFrame / progress.totalFrames) * 100}%`
              }}
              variants={progressVariants}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
