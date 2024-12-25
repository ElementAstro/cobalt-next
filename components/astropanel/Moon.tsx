import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MoonData } from "@/types/astropanel";
import { motion } from "framer-motion";
import { useAstroStore } from "@/lib/store/astropanel";
import { Moon as MoonIcon, ArrowUp, ArrowDown } from "lucide-react";

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
      className="bg-gradient-to-br from-indigo-950/90 to-gray-900/95 p-4 rounded-xl shadow-xl border border-indigo-800/20 backdrop-blur-sm"
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2">
          <motion.div
            className="flex items-start gap-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-lg opacity-20" />
              <Image
                src={`/assets/img/moon_${data.phase}.png`}
                alt="Moon"
                layout="fill"
                objectFit="contain"
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-indigo-100 mb-2 flex items-center gap-2">
                <MoonIcon className="w-6 h-6 text-indigo-400" />
                月亮信息
              </CardTitle>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-indigo-200 text-sm">升起时间</div>
                    <div className="text-white font-semibold">
                      {celestialData.moon.rise || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-5 h-5 text-indigo-400" />
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
          <div className="grid grid-cols-3 gap-2">
            <InfoCard
              label="过境时间"
              value={data.transit || "N/A"}
              className="from-blue-950/40 to-indigo-950/40"
            />
            <InfoCard
              label="方位角"
              value={`${data.az || "N/A"}°`}
              className="from-indigo-950/40 to-violet-950/40"
            />
            <InfoCard
              label="高度角"
              value={`${data.alt || "N/A"}°`}
              className="from-violet-950/40 to-purple-950/40"
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
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`p-2 rounded-lg bg-gradient-to-br ${className} border border-indigo-800/10 backdrop-blur-sm`}
    >
      <div className="text-indigo-200/80 text-xs mb-1">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}
