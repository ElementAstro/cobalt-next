import Image from "next/image";
import { motion } from "framer-motion";
import { CelestialData } from "@/types/astropanel";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useAstroStore } from "@/lib/store/astropanel";
import { AlertCircle, AlertTriangle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface SolarSystemProps {
  data: CelestialData;
}

export function SolarSystem() {
  const { data, error, updateData } = useAstroStore();

  useEffect(() => {
    updateData();
  }, [updateData]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          错误: {error}
        </div>
      </div>
    );
  }

  if (!data.solarSystem) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          太阳系数据不可用
        </div>
      </div>
    );
  }

  const planets = [
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-950/90 to-gray-900/95 rounded-xl shadow-xl border border-purple-800/20 backdrop-blur-sm p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-purple-100 flex items-center gap-2">
            <motion.div
              className="w-6 h-6 text-purple-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ⚫
            </motion.div>
            太阳系行星
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-purple-800/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-purple-900/30">
                  <TableRow className="hover:bg-purple-800/20">
                    <TableHead className="text-purple-200 font-medium">
                      行星
                    </TableHead>
                    <TableHead className="text-purple-200 font-medium">
                      升起
                    </TableHead>
                    <TableHead className="text-purple-200 font-medium">
                      过境
                    </TableHead>
                    <TableHead className="text-purple-200 font-medium">
                      落下
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-purple-950/20">
                  {planets.map((planet, index) => (
                    <TableRow
                      key={planet}
                      className="hover:bg-purple-800/20 transition-colors"
                    >
                      <TableCell className="font-medium capitalize text-purple-100">
                        {planet}
                      </TableCell>
                      <TableCell className="text-purple-200">
                        {data?.solarSystem?.planets?.[index]?.rise ?? "N/A"}
                      </TableCell>
                      <TableCell className="text-purple-200">
                        {data?.solarSystem?.planets?.[index]?.transit ?? "N/A"}
                      </TableCell>
                      <TableCell className="text-purple-200">
                        {data?.solarSystem?.planets?.[index]?.set ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getPlanetColor(altitude: string): string {
  const alt = parseFloat(altitude);
  if (alt > 25) return "text-green-500";
  if (alt > 0) return "text-orange-500";
  return "text-white";
}

function formatData(value: any): string | number {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return "N/A";
}
