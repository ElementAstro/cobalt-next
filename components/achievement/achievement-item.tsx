import { Achievement } from "@/types/achievement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AchievementItemProps {
  achievement: Achievement;
  onUnlock: (achievement: Achievement) => void;
  isMockMode: boolean;
}

export function AchievementItem({
  achievement,
  onUnlock,
  isMockMode,
}: AchievementItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercentage =
    (achievement.progress / achievement.totalRequired) * 100;

  const handleUnlock = () => {
    if (
      !achievement.isUnlocked &&
      (isMockMode || achievement.progress >= achievement.totalRequired)
    ) {
      onUnlock(achievement);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <Card
        className={`
        w-full transition-all duration-300 ease-in-out
        ${
          achievement.isUnlocked
            ? "dark:bg-gradient-to-r dark:from-green-900 dark:to-blue-900"
            : "dark:bg-gray-800"
        }
        hover:shadow-xl dark:shadow-gray-900
      `}
      >
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <motion.div
            className={`
              w-16 h-16 flex items-center justify-center text-4xl rounded-full
              ${
                achievement.isUnlocked
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : "bg-gray-200 dark:bg-gray-700"
              }
            `}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {achievement.icon}
          </motion.div>
          <div>
            <CardTitle className="dark:text-white">
              {achievement.title}
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              {achievement.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              {achievement.category}
            </span>
            <span className="text-sm font-semibold">
              {achievement.points} points
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Progress: {achievement.progress} / {achievement.totalRequired}
            </p>
            {achievement.isUnlocked ? (
              <motion.span
                className="text-green-600 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Unlocked!
              </motion.span>
            ) : isMockMode ? (
              <Button onClick={handleUnlock} size="sm">
                Mock Unlock
              </Button>
            ) : (
              <motion.span
                className="text-blue-600 font-semibold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                In Progress
              </motion.span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
