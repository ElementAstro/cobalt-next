import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LiveStackingProps {
  onClose: () => void;
}

export function LiveStacking({ onClose }: LiveStackingProps) {
  const [isStacking, setIsStacking] = useState(false);
  const [stackedImages, setStackedImages] = useState(0);
  const [snr, setSNR] = useState(0);

  useEffect(() => {
    if (isStacking) {
      const interval = setInterval(() => {
        setStackedImages((prev) => prev + 1);
        setSNR((prev) => Math.min(100, prev + Math.random() * 5));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isStacking]);

  const toggleStacking = () => {
    setIsStacking(!isStacking);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Live Stacking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Stacked Images</h3>
            <p className="text-3xl font-bold">{stackedImages}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Signal-to-Noise Ratio</h4>
            <Progress value={snr} className="w-full" />
            <p className="text-sm text-right">{snr.toFixed(2)}%</p>
          </div>
          <Button onClick={toggleStacking}>
            {isStacking ? "Stop Stacking" : "Start Stacking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
