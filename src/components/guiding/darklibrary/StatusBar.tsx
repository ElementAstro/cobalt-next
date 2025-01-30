import { DarkFieldProgress } from "@/types/guiding/darkfield";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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
  };

  return (
    <motion.div
      className="p-2 border-b bg-background/95 backdrop-blur"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline">{stageText[stage]}</Badge>
          <span className="text-sm">
            {progress.currentFrame} / {progress.totalFrames} 帧
          </span>
          <span className="text-sm">当前曝光: {progress.currentExposure}s</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            预计剩余时间: {Math.ceil(progress.estimatedTimeLeft / 60)}分钟
          </span>
          {warnings.length > 0 && (
            <Badge variant="destructive">{warnings.length}个警告</Badge>
          )}
        </div>
      </div>
      <Progress
        value={(progress.currentFrame / progress.totalFrames) * 100}
        className="mt-2"
      />
    </motion.div>
  );
}
