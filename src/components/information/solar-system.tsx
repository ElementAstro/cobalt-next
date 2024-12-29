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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.solarSystem.planets.map((planet, index) => (
                <motion.div
                  key={planet.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    },
                  }}
                >
                  <PlanetCard
                    planet={planet}
                    viewMode="grid"
                    favorite={favoriteList.includes(planet.name)}
                    onToggleFavorite={handleToggleFavorite}
                    onShowDetail={() => setSelectedPlanet(planet)}
                  />
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
