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
import { Achievement } from "@/types/achievement";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          className="grid gap-4 md:gap-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sm:p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Achievements
              </h2>
              <Input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border-gray-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full bg-gray-700/50 border-gray-600">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-gray-700/50 border-gray-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <div className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {totalPoints} Points
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="mock-mode"
                  checked={isMockMode}
                  onCheckedChange={toggleMockMode}
                />
                <Label htmlFor="mock-mode" className="text-gray-300">
                  Mock Mode
                </Label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievement Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 
            ${isLandscape ? "h-[calc(100vh-16rem)] overflow-y-auto" : ""}`}
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
