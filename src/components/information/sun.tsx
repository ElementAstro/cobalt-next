"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAstroStore } from "@/store/useInformationStore";
import { Sunrise, Sunset, Sun as SunIcon } from "lucide-react";

const sunInfoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const glowVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function Sun() {
  const celestialData = useAstroStore((state) => state.data);

  if (!celestialData || !celestialData.sun) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">
          无法加载太阳数据
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={sunInfoVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-amber-950/90 to-gray-900/95 p-4 rounded-xl shadow-xl border border-amber-800/20 backdrop-blur-sm"
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2">
          <motion.div className="relative">
            <motion.div
              className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="flex items-start gap-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 blur-lg opacity-20" />
                <Image
                  src="/assets/img/sun.png"
                  alt="Sun"
                  layout="fill"
                  objectFit="contain"
                  className="relative z-10 drop-shadow-2xl"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-amber-100 mb-2 flex items-center gap-2">
                  <SunIcon className="w-6 h-6 text-amber-400" />
                  太阳信息
                </CardTitle>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-amber-200 text-sm">日出时间</div>
                      <div className="text-white font-semibold">
                        {celestialData.sun.rise}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-amber-200 text-sm">日落时间</div>
                      <div className="text-white font-semibold">
                        {celestialData.sun.set}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            <TimeCard
              label="天文晨光"
              time={celestialData.sun.at_start}
              type="dawn"
            />
            <TimeCard
              label="民用晨光"
              time={celestialData.sun.ct_start}
              type="dawn"
            />
            <TimeCard
              label="中天"
              time={celestialData.sun.transit}
              type="noon"
            />
            <TimeCard
              label="民用暮光"
              time={celestialData.sun.ct_end}
              type="dusk"
            />
            <TimeCard
              label="天文暮光"
              time={celestialData.sun.at_end}
              type="dusk"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TimeCard({
  label,
  time,
  type,
}: {
  label: string;
  time: string;
  type: "dawn" | "noon" | "dusk";
}) {
  const getBgColor = () => {
    switch (type) {
      case "dawn":
        return "from-blue-950/40 to-amber-950/40";
      case "noon":
        return "from-amber-950/40 to-orange-950/40";
      case "dusk":
        return "from-purple-950/40 to-blue-950/40";
    }
  };

  return (
    <div
      className={`p-2 rounded-lg bg-gradient-to-br ${getBgColor()} border border-amber-800/10 backdrop-blur-sm`}
    >
      <div className="text-amber-200/80 text-xs mb-1">{label}</div>
      <div className="text-white font-medium">{time}</div>
    </div>
  );
}
