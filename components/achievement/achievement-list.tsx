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
import { useOrientation } from "@/hooks/use-orientation";

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
  const isLandscape = useOrientation();
  const [animationPreference, setAnimationPreference] = useState("default");

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

  const gridColumns = useMemo(() => {
    if (isLandscape) {
      return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4";
    }
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }, [isLandscape]);

  // 在 AchievementList 组件内添加新的排序功能
  const sortOptions = {
    newest: (a: Achievement, b: Achievement) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    points: (a: Achievement, b: Achievement) => b.points - a.points,
    progress: (a: Achievement, b: Achievement) =>
      b.progress / b.totalRequired - a.progress / a.totalRequired,
  };

  const [sortBy, setSortBy] = useState("newest");

  // 在过滤后的成就列表上应用排序
  const sortedAchievements = useMemo(() => {
    return [...filteredAchievements].sort(
      sortOptions[sortBy as keyof typeof sortOptions]
    );
  }, [filteredAchievements, sortBy]);

  return (
    <div
      className={`space-y-4 p-4 dark:bg-gray-900 ${
        isLandscape ? "h-[100vh] overflow-hidden" : ""
      }`}
    >
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
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

      <div className="flex items-center space-x-4 mb-4">
        <Select
          value={animationPreference}
          onValueChange={setAnimationPreference}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Animation Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className={`grid ${gridColumns} gap-4 ${
          isLandscape ? "h-[calc(100vh-200px)] overflow-y-auto" : ""
        }`}
      >
        <AnimatePresence mode="popLayout">
          {sortedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={getInitialAnimation(animationPreference)}
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

function getInitialAnimation(preference: string) {
  switch (preference) {
    case "bounce":
      return { scale: 0.3, y: 100 };
    case "fade":
      return { opacity: 0 };
    case "slide":
      return { x: -100, opacity: 0 };
    default:
      return { opacity: 0, y: 50 };
  }
}

// Add similar functions for animate and exit animations
