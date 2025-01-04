"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MoonData } from "@/types/infomation";
import { motion } from "framer-motion";
import { useAstroStore } from "@/store/useInformationStore";
import {
  Moon as MoonIcon,
  ArrowUp,
  ArrowDown,
  Compass,
  Clock,
  AlignCenter,
  Calendar,
  BarChart2,
  Crosshair,
  SunDim,
} from "lucide-react";

const moonGlowVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const moonRotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 40,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

interface MoonProps {
  data: MoonData;
}

export function Moon({ data }: MoonProps) {
  const { data: celestialData } = useAstroStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-950/90 to-gray-900/95 p-4 rounded-xl shadow-xl border border-indigo-800/20 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Add stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2">
          <motion.div
            className="flex items-start gap-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-28 h-28">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-lg opacity-20"
                variants={moonGlowVariants}
                animate="animate"
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                variants={moonRotateVariants}
                animate="animate"
              >
                <Image
                  src={`/assets/img/moon_${data.phase}.png`}
                  alt="Moon"
                  layout="fill"
                  objectFit="contain"
                  className="relative z-10 drop-shadow-2xl"
                />
              </motion.div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-indigo-100 mb-2 flex items-center gap-2">
                <MoonIcon className="w-6 h-6 text-indigo-400" />
                月亮信息
              </CardTitle>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-indigo-200 text-sm">升起时间</div>
                    <div className="text-white font-semibold">
                      {celestialData.moon.rise || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-indigo-200 text-sm">落下时间</div>
                    <div className="text-white font-semibold">
                      {celestialData.moon.set || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InfoCard
              icon={<Clock className="w-4 h-4 text-sky-400" />}
              label="过境时间"
              value={data.transit || "N/A"}
              className="from-blue-950/40 to-indigo-950/40"
            />
            <InfoCard
              icon={<Compass className="w-4 h-4 text-amber-400" />}
              label="方位角"
              value={`${data.az || "N/A"}°`}
              className="from-indigo-950/40 to-violet-950/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <InfoCard
              icon={<AlignCenter className="w-4 h-4 text-purple-400" />}
              label="高度角"
              value={`${data.alt || "N/A"}°`}
              className="from-violet-950/40 to-purple-950/40"
            />
            <InfoCard
              icon={<BarChart2 className="w-4 h-4 text-cyan-400" />}
              label="照明度"
              value={`${data.light}%`}
              className="from-purple-950/40 to-blue-950/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <InfoCard
              icon={<Calendar className="w-4 h-4 text-indigo-400" />}
              label="新月时间"
              value={data.new || "N/A"}
              className="from-blue-950/40 to-indigo-950/40"
            />
            <InfoCard
              icon={<SunDim className="w-4 h-4 text-yellow-400" />}
              label="满月时间"
              value={data.full || "N/A"}
              className="from-indigo-950/40 to-violet-950/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Crosshair className="w-4 h-4 text-emerald-400" />}
              label="赤经"
              value={data.ra || "N/A"}
              className="from-violet-950/40 to-purple-950/40"
            />
            <InfoCard
              icon={<Crosshair className="w-4 h-4 text-pink-400" />}
              label="赤纬"
              value={data.dec || "N/A"}
              className="from-purple-950/40 to-blue-950/40"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-indigo-200 text-sm">月相</div>
                <div className="text-white font-semibold">{data.phase}</div>
              </div>
              <div className="text-right">
                <div className="text-indigo-200 text-sm">月亮照明度</div>
                <div className="text-white font-semibold">{data.light}%</div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 rounded-lg bg-gradient-to-br ${className} border border-indigo-800/10 backdrop-blur-sm`}
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-1"
      >
        {icon}
        <div className="text-indigo-200/80 text-xs">{label}</div>
      </motion.div>
      <div className="text-white font-medium ml-6">{value}</div>
    </motion.div>
  );
}
