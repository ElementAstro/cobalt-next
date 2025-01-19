"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAstroStore } from "@/store/useInformationStore";
import { PlanetCard } from "./planet-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { PlanetDetail } from "./planet-detail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlanetData } from "@/types/infomation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const starFieldVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const orbitVariants = {
  hidden: { scale: 0 },
  visible: (i: number) => ({
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 1,
      ease: "backOut",
    },
  }),
};

const planetVariants = {
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, 0],
    boxShadow: "0px 10px 30px rgba(192, 132, 252, 0.3)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 8,
    },
  },
  tap: {
    scale: 0.9,
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.2,
    },
  },
};

export function SolarSystem() {
  const { data, error, updateData } = useAstroStore();
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [favoriteList, setFavoriteList] = useState<string[]>([]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const handleToggleFavorite = (name: string) => {
    setFavoriteList((prev) => {
      const isExist = prev.includes(name);
      if (isExist) {
        toast({
          title: "取消收藏",
          description: `已取消收藏 ${name}`,
          variant: "default",
        });
        return prev.filter((item) => item !== name);
      } else {
        toast({
          title: "收藏成功",
          description: `已收藏 ${name}`,
          variant: "default",
        });
        return [...prev, name];
      }
    });
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg bg-purple-950/20" />
        ))}
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="relative bg-gradient-to-br from-purple-950/90 to-gray-900/95 rounded-xl shadow-xl border border-purple-800/20 backdrop-blur-sm p-4 overflow-hidden min-h-[calc(100vh-4rem)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Star field background */}
        <motion.div
          className="absolute inset-0 z-0"
          variants={starFieldVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/80 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                filter: `blur(${Math.random() * 2}px)`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
                x: [0, Math.random() * 10 - 5, 0],
                y: [0, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
                repeatType: "mirror",
              }}
            />
          ))}
        </motion.div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.solarSystem.planets.map((planet, index) => (
                <motion.div
                  key={planet.name}
                  className="relative"
                  variants={orbitVariants}
                  custom={index}
                >
                  <motion.div
                    className="absolute inset-0 border border-purple-800/20 rounded-full"
                    style={{
                      width: `${100 + index * 30}%`,
                      height: `${100 + index * 30}%`,
                      top: `-${index * 15}%`,
                      left: `-${index * 15}%`,
                    }}
                    animate={{
                      rotate: 360,
                      opacity: [0.4, 0.8, 0.4],
                      borderWidth: [1, 2, 1],
                    }}
                    transition={{
                      duration: 20 + index * 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      },
                      hover: planetVariants.hover,
                      tap: planetVariants.tap,
                    }}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <PlanetCard
                      planet={planet}
                      viewMode="grid"
                      favorite={favoriteList.includes(planet.name)}
                      onToggleFavorite={handleToggleFavorite}
                      onShowDetail={() => setSelectedPlanet(planet)}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog
        open={!!selectedPlanet}
        onOpenChange={() => setSelectedPlanet(null)}
      >
        <DialogContent className="p-0 border-0 max-w-4xl bg-transparent">
          {selectedPlanet && (
            <PlanetDetail
              planet={selectedPlanet}
              onClose={() => setSelectedPlanet(null)}
              onToggleFavorite={handleToggleFavorite}
              favorite={favoriteList.includes(selectedPlanet.name)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
