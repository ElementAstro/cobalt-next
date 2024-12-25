"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { useAstroStore } from "@/lib/store/astropanel";
import { Sun } from "@/components/astropanel/Sun";
import { Moon } from "@/components/astropanel/Moon";
import { PolarFinder } from "@/components/astropanel/PolarFinder";
import { SolarSystem } from "@/components/astropanel/SolarSystem";
import { CelestialInfo } from "@/components/astropanel/CelestialInfo";
import { TimeGradientBar } from "@/components/astropanel/TimeGradientBar";
import Layout from "./layout";

export default function AstroPanel() {
  const { data, showWeather } = useAstroStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <Layout>
      {/* Weather Section */}
      {showWeather && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Weather info cards */}
          {/* ...其他现有内容... */}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4">
        {/* Time Gradient Bar */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <TimeGradientBar />
          </Card>
        </motion.div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sun & Moon Card */}
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

          {/* Polar Finder Card */}
          <ExpandableCard
            isExpanded={expandedSection === "polar"}
            onExpand={() => setExpandedSection("polar")}
            onCollapse={() => setExpandedSection(null)}
          >
            <PolarFinder />
          </ExpandableCard>

          {/* Celestial Info Card */}
          <ExpandableCard
            isExpanded={expandedSection === "info"}
            onExpand={() => setExpandedSection("info")}
            onCollapse={() => setExpandedSection(null)}
          >
            <CelestialInfo />
          </ExpandableCard>
        </div>

        {/* Solar System Card */}
        <ExpandableCard
          isExpanded={expandedSection === "solar"}
          onExpand={() => setExpandedSection("solar")}
          onCollapse={() => setExpandedSection(null)}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
        >
          <SolarSystem />
        </ExpandableCard>
      </div>
    </Layout>
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
      layout
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
