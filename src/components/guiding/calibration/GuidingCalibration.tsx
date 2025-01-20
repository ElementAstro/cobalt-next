"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import CalibrationCanvas from "./CalibrationCanvas";
import CalibrationControls from "./CalibrationControls";
import CalibrationData from "./CalibrationData";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/store/useGuidingStore";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Maximize, Minimize, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function GuidingCalibration() {
  const { isLandscape, setIsLandscape } = useGuidingStore().calibration;
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [layout, setLayout] = useState<"split" | "full">("split");
  const [panelSizes, setPanelSizes] = useLocalStorage<number[]>(
    "calibration-layout-sizes",
    [60, 40]
  );

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsMobileLandscape(isLandscape);
      setIsLandscape(isLandscape);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // 监听屏幕旋转
    window.screen?.orientation?.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.screen?.orientation?.removeEventListener("change", handleResize);
    };
  }, [setIsLandscape]);

  const toggleLayout = () => {
    setLayout(prev => prev === "split" ? "full" : "split");
  };

  const handleLayoutChange = (sizes: number[]) => {
    setPanelSizes(sizes);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto p-2 sm:p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 min-h-screen"
    >
      <Card className="bg-gray-800/95 border-gray-700 shadow-lg rounded-lg backdrop-blur-sm">
        <TooltipProvider>
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                  onClick={toggleLayout}
                >
                  {layout === "split" ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{layout === "split" ? "全屏显示" : "分屏显示"}</p>
              </TooltipContent>
            </Tooltip>

            {layout === "split" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                    onClick={() => setPanelSizes([60, 40])}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>保存当前布局</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>

        {layout === "split" ? (
          <ResizablePanelGroup
            direction={isLandscape || isMobileLandscape ? "horizontal" : "vertical"}
            className="min-h-[600px]"
            onLayout={handleLayoutChange}
          >
            <ResizablePanel defaultSize={panelSizes[0]} minSize={40}>
              <div className="h-full p-2 sm:p-4 flex flex-col gap-4">
                <CalibrationCanvas />
                <CalibrationControls />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={panelSizes[1]} minSize={30}>
              <div className="h-full p-2 sm:p-4">
                <CalibrationData />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="p-2 sm:p-4">
            <CalibrationCanvas />
            <div className="mt-4">
              <CalibrationControls />
            </div>
            <div className="mt-4">
              <CalibrationData />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
