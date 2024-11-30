import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FocusAssistantProps {
  onClose: () => void;
}

export function FocusAssistant({ onClose }: FocusAssistantProps) {
  const [focusScore, setFocusScore] = useState(0);
  const [isFocusing, setIsFocusing] = useState(false);

  useEffect(() => {
    if (isFocusing) {
      const interval = setInterval(() => {
        setFocusScore((prevScore) => {
          const newScore = prevScore + Math.random() * 10 - 5;
          return Math.max(0, Math.min(100, newScore));
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isFocusing]);

  const handleStartFocus = () => {
    setIsFocusing(true);
  };

  const handleStopFocus = () => {
    setIsFocusing(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Focus Assistant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Focus Score</h3>
            <p className="text-3xl font-bold">{focusScore.toFixed(2)}</p>
          </div>
          <Progress value={focusScore} className="w-full" />
          <div className="flex justify-center space-x-4">
            <Button onClick={handleStartFocus} disabled={isFocusing}>
              Start Focus
            </Button>
            <Button onClick={handleStopFocus} disabled={!isFocusing}>
              Stop Focus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
