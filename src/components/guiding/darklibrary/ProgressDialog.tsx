import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DarkFieldProgress } from "@/types/guiding/darkfield";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: DarkFieldProgress;
  currentTemp: number;
}

export function ProgressDialog({ open, onOpenChange, progress, currentTemp }: ProgressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>创建进度详情</DialogTitle>
          <DialogDescription>
            <ScrollArea className="h-[300px] mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p>当前阶段: {progress.stage}</p>
                  <p>已完成: {progress.currentFrame}/{progress.totalFrames} 帧</p>
                  <p>当前曝光: {progress.currentExposure}s</p>
                  <p>当前温度: {currentTemp.toFixed(1)}°C</p>
                  <p>预计剩余: {Math.ceil(progress.estimatedTimeLeft / 60)}分钟</p>
                </div>
                
                {progress.warnings.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <h4 className="font-medium">警告信息</h4>
                    <ul className="space-y-1 text-sm">
                      {progress.warnings.map((warning, i) => (
                        <li key={i} className="text-yellow-500">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
