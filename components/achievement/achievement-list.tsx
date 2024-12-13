import { useState, useMemo } from "react";
import { AchievementItem } from "./achievement-item";
import { AchievementNotification } from "./achievement-notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievementStore } from "@/lib/store/achievement";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AchievementList() {
  const {
    achievements,
    lastUnlockedAchievement,
    isMockMode,
    unlockAchievement,
    toggleMockMode,
  } = useAchievementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(achievements.map((a) => a.category)))];
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(
      (a) =>
        (selectedCategory === "All" || a.category === selectedCategory) &&
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [achievements, selectedCategory, searchTerm]);

  const totalPoints = useMemo(() => {
    return achievements.reduce(
      (sum, a) => sum + (a.isUnlocked ? a.points : 0),
      0
    );
  }, [achievements]);

  const overallProgress = useMemo(() => {
    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
    return (unlockedCount / achievements.length) * 100;
  }, [achievements]);

  return (
    <div className="space-y-4 p-4 dark:bg-gray-900">
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full lg:w-auto">
          <h2 className="text-2xl font-bold dark:text-white">Achievements</h2>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow dark:bg-gray-800 dark:text-white"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="dark:text-white">
            <span className="font-bold">Total Points:</span> {totalPoints}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="mock-mode"
              checked={isMockMode}
              onCheckedChange={toggleMockMode}
              className="dark:bg-gray-700"
            />
            <Label htmlFor="mock-mode" className="dark:text-white">
              Mock Mode
            </Label>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <Link href={`/achievement/${achievement.id}`} className="block">
                <AchievementItem
                  achievement={achievement}
                  onUnlock={() => unlockAchievement(achievement.id)}
                  isMockMode={isMockMode}
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AchievementNotification achievement={lastUnlockedAchievement} />
    </div>
  );
}
