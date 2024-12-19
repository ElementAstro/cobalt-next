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
    recentUnlocks: achievements.filter((a) =>
      a.isUnlocked && a.unlockedAt
        ? new Date(a.unlockedAt).getTime() >
          Date.now() - 7 * 24 * 60 * 60 * 1000
        : false
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
      className="p-4"
    >
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Achievement Statistics
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats Grid */}
          {[
            {
              label: "Total Points",
              value: totalPoints,
              icon: "🏆",
              color: "from-yellow-400 to-orange-400",
            },
            {
              label: "Overall Progress",
              value: `${overallProgress.toFixed(1)}%`,
              icon: "📈",
              color: "from-green-400 to-emerald-400",
            },
            {
              label: "Recent Unlocks",
              value: stats.recentUnlocks,
              icon: "🎯",
              color: "from-purple-400 to-pink-400",
            },
            {
              label: "Rarity Score",
              value: stats.rarityScore.toFixed(3),
              icon: "💫",
              color: "from-blue-400 to-indigo-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p
                    className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
