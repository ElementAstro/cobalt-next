import { Achievement } from "@/types/achievement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AchievementItemProps {
  achievement: Achievement;
  onUnlock: (achievement: Achievement) => void;
  isMockMode: boolean;
  animationStyle?: string;
}

export function AchievementItem({
  achievement,
  onUnlock,
  isMockMode,
  animationStyle = "default",
}: AchievementItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  // 添加新的动画效果
  const unlockAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      filter: ["brightness(100%)", "brightness(200%)", "brightness(100%)"],
    },
    transition: { duration: 0.8 },
  };

  // 在 Card 组件中添加手势支持
  const [[rotateX, rotateY], setRotate] = useState([0, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setRotate([rotateX, rotateY]);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <Card
        className={`
          relative w-full transition-all duration-300 ease-in-out
          ${
            achievement.isUnlocked
              ? "dark:bg-gradient-to-r dark:from-green-900 dark:to-blue-900"
              : "dark:bg-gray-800"
          }
          hover:shadow-xl dark:shadow-gray-900
          ${showDetails ? "transform-gpu translate-y-[-10px]" : ""}
        `}
        onClick={() => setShowDetails(!showDetails)}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotate([0, 0])}
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
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <p className="text-sm dark:text-gray-300">
                {achievement.detailedDescription}
              </p>
              <div className="mt-2">
                <h4 className="font-semibold">Completion Steps:</h4>
                <ul className="list-disc list-inside">
                  {achievement.steps?.map((step, index) => (
                    <li
                      key={index}
                      className={`text-sm ${
                        step.completed ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
