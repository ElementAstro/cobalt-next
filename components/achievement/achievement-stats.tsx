import { useAchievementStore } from "@/lib/store/achievement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export function AchievementStats() {
  const { getTotalPoints, getOverallProgress, achievements } =
    useAchievementStore();

  const totalPoints = getTotalPoints();
  const overallProgress = getOverallProgress();

  // 添加新的统计数据
  const stats = {
    recentUnlocks: achievements.filter(
      (a) =>
        a.isUnlocked &&
        new Date(a.unlockedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
    rarityScore: achievements.reduce(
      (acc, a) =>
        acc +
        (a.isUnlocked
          ? 1 / achievements.filter((b) => b.isUnlocked).length
          : 0),
      0
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardTitle className="dark:text-white">
              Achievement Statistics
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm font-medium dark:text-gray-300">
              Total Points
            </p>
            <p className="text-2xl font-bold dark:text-white">{totalPoints}</p>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm font-medium dark:text-gray-300">
              Overall Progress
            </p>
            <Progress
              value={overallProgress}
              className="w-full dark:bg-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {overallProgress.toFixed(2)}%
            </p>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-sm font-medium dark:text-gray-300">
              Recent Unlocks (7 days)
            </p>
            <p className="text-xl font-bold dark:text-white">
              {stats.recentUnlocks}
            </p>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm font-medium dark:text-gray-300">
              Rarity Score
            </p>
            <p className="text-xl font-bold dark:text-white">
              {stats.rarityScore.toFixed(3)}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
