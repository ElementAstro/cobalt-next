"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { useAstroStore } from "@/store/useInformationStore";
import { Sun } from "@/components/information/sun";
import { Moon } from "@/components/information/moon";
import { PolarFinder } from "@/components/information/polar-finder";
import { SolarSystem } from "@/components/information/solar-system";
import { CelestialInfo } from "@/components/information/celestial-info";
import { TimeGradientBar } from "@/components/information/time-gradient-bar";
import WeatherInfo from "@/components/information/weather-info";

export default function AstroPanel() {
  const { data, showWeather, toggleWeather } = useAstroStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCloseWeather = () => {
    toggleWeather();
  };

  return (
    <>
      {/* 天气部分 */}
      {showWeather && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <WeatherInfo onClose={handleCloseWeather} />
        </motion.div>
      )}

      {/* 主内容 */}
      <div className="grid grid-cols-1 gap-4">
        {/* 时间渐变条 */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <TimeGradientBar />
          </Card>
        </motion.div>

        {/* 主要信息网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 太阳与月亮卡片 */}
          <ExpandableCard
            isExpanded={expandedSection === "celestial"}
            onExpand={() => setExpandedSection("celestial")}
            onCollapse={() => setExpandedSection(null)}
          >
            <Tabs defaultValue="sun" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="sun" className="w-1/2">
                  太阳
                </TabsTrigger>
                <TabsTrigger value="moon" className="w-1/2">
                  月亮
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sun">
                <Sun />
              </TabsContent>
              <TabsContent value="moon">
                <Moon data={data.moon} />
              </TabsContent>
            </Tabs>
          </ExpandableCard>

          {/* 极地查找器卡片 */}
          <ExpandableCard
            isExpanded={expandedSection === "polar"}
            onExpand={() => setExpandedSection("polar")}
            onCollapse={() => setExpandedSection(null)}
          >
            <PolarFinder />
          </ExpandableCard>

          {/* 天体信息卡片 */}
          <ExpandableCard
            isExpanded={expandedSection === "info"}
            onExpand={() => setExpandedSection("info")}
            onCollapse={() => setExpandedSection(null)}
          >
            <CelestialInfo />
          </ExpandableCard>
        </div>

        {/* 太阳系卡片 */}
        <ExpandableCard
          isExpanded={expandedSection === "solar"}
          onExpand={() => setExpandedSection("solar")}
          onCollapse={() => setExpandedSection(null)}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
        >
          <SolarSystem />
        </ExpandableCard>
      </div>
    </>
  );
}

interface ExpandableCardProps {
  children: React.ReactNode;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  className?: string;
}

function ExpandableCard({
  children,
  isExpanded,
  onExpand,
  onCollapse,
  className,
}: ExpandableCardProps) {
  return (
    <motion.div
      className={`relative ${isExpanded ? "col-span-full" : ""}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 ${className}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={isExpanded ? onCollapse : onExpand}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {children}
      </Card>
    </motion.div>
  );
}
