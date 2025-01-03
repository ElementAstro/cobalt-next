"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { useAstroStore } from "@/store/useInformationStore";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import PolarScope from "./polar-scope";

const reticleVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const polarisVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

export function PolarFinder() {
  const { data: celestialData, loadingStates, error } = useAstroStore();
  const isLoading = loadingStates["data"];

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-950/50 border-red-800/50">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-200">{error}</AlertDescription>
      </Alert>
    );
  }

  const phaAngle = celestialData.polaris
    ? 360 + (celestialData.polaris.hour_angle || 0) * -1 - 180
    : 0;

  const phaFormatted = formatPHA(celestialData.polaris?.hour_angle || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-950/90 to-gray-900/95 rounded-xl shadow-xl border border-blue-800/20 backdrop-blur-sm p-4"
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-blue-100 flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-blue-400"
            >
              ★
            </motion.div>
            北极星指示
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {isLoading ? (
              <Skeleton className="w-72 h-72 rounded-full bg-blue-900/20" />
            ) : (
              <motion.div
                className="relative w-72 h-72"
                variants={reticleVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  animate={{ rotate: phaAngle }}
                  transition={{ duration: 1, type: "spring" }}
                  className="w-full h-full"
                >
                  <PolarScope />
                </motion.div>
              </motion.div>
            )}

            <div className="flex-1 min-w-[200px]">
              <p className="text-sm mb-4 text-blue-300/80">
                通过极轴镜观察视图
              </p>
              <Table>
                <TableBody>
                  <TableRow className="hover:bg-blue-900/20">
                    <TableCell className="font-medium text-blue-200">
                      时角
                    </TableCell>
                    <TableCell className="text-blue-100">
                      {isLoading ? (
                        <Skeleton className="h-4 w-24 bg-blue-900/20" />
                      ) : (
                        phaFormatted
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-blue-900/20">
                    <TableCell className="font-medium text-blue-200">
                      下一次中天
                    </TableCell>
                    <TableCell className="text-blue-100">
                      {isLoading ? (
                        <Skeleton className="h-4 w-24 bg-blue-900/20" />
                      ) : (
                        celestialData.polaris?.next_transit || "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-blue-900/20">
                    <TableCell className="font-medium text-blue-200">
                      高度角
                    </TableCell>
                    <TableCell className="text-blue-100">
                      {isLoading ? (
                        <Skeleton className="h-4 w-24 bg-blue-900/20" />
                      ) : (
                        celestialData.polaris?.alt || "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function formatPHA(pha: number): string {
  if (typeof pha !== "number") return "00:00:00";

  const phaH = String(Math.floor(Math.abs(pha) / 15)).padStart(2, "0");
  const phaMtmp = (Math.abs(pha) / 15 - Math.floor(Math.abs(pha) / 15)) * 60;
  const phaM = String(Math.floor(phaMtmp)).padStart(2, "0");
  const phaS = String(
    Math.floor((phaMtmp - Math.floor(phaMtmp)) * 60)
  ).padStart(2, "0");

  const sign = pha < 0 ? "-" : "";
  return `${sign}${phaH}:${phaM}:${phaS}`;
}
