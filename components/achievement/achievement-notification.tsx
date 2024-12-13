import { useState, useEffect } from "react";
import { Achievement } from "@/types/achievement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AchievementNotificationProps {
  achievement: Achievement | null;
}

export function AchievementNotification({
  achievement,
}: AchievementNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.3 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white overflow-hidden">
            <CardHeader className="pb-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-xl">Achievement Unlocked!</CardTitle>
                <CardDescription className="text-white opacity-80">
                  {achievement.title}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="text-4xl mb-2"
              >
                {achievement.icon}
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg font-semibold"
              >
                {achievement.points} points earned!
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
