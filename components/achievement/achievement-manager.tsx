import { useState } from "react";
import { useAchievementStore } from "@/lib/store/achievement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export function AchievementManager() {
  const { achievements, incrementProgress, resetProgress, resetAllProgress } =
    useAchievementStore();
  const [selectedAchievement, setSelectedAchievement] = useState(
    achievements[0]?.id || ""
  );
  const [progressAmount, setProgressAmount] = useState(1);

  const handleIncrementProgress = () => {
    if (selectedAchievement) {
      incrementProgress(selectedAchievement, progressAmount);
      toast({
        title: "Progress Updated",
        description: `Incremented progress for "${
          achievements.find((a) => a.id === selectedAchievement)?.title
        }" by ${progressAmount}.`,
      });
    }
  };

  const handleResetProgress = () => {
    if (selectedAchievement) {
      resetProgress(selectedAchievement);
      toast({
        title: "Progress Reset",
        description: `Reset progress for "${
          achievements.find((a) => a.id === selectedAchievement)?.title
        }".`,
      });
    }
  };

  const handleResetAllProgress = () => {
    resetAllProgress();
    toast({
      title: "All Progress Reset",
      description: "Reset progress for all achievements.",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Achievement Manager</h2>
      <div className="flex space-x-2">
        <Select
          value={selectedAchievement}
          onValueChange={setSelectedAchievement}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select achievement" />
          </SelectTrigger>
          <SelectContent>
            {achievements.map((achievement) => (
              <SelectItem key={achievement.id} value={achievement.id}>
                {achievement.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={progressAmount}
          onChange={(e) => setProgressAmount(Number(e.target.value))}
          min={1}
          max={100}
          className="w-20"
        />
        <Button onClick={handleIncrementProgress}>Increment Progress</Button>
        <Button onClick={handleResetProgress} variant="outline">
          Reset Progress
        </Button>
      </div>
      <Button onClick={handleResetAllProgress} variant="destructive">
        Reset All Progress
      </Button>
    </div>
  );
}
