"use client";

import { useState } from "react";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

export function PreviewWindow() {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#666666");
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const { equipment, selectedEquipment, deselectEquipment } =
    useAstronomyStore();

  const selectedEquipmentDetails = equipment.filter((eq) =>
    selectedEquipment.includes(eq.id)
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-4 gap-4 landscape:md:grid-cols-[1fr_300px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ minHeight: "calc(100vh - 2rem)" }}
    >
      <div className="col-span-1 lg:col-span-3 min-h-[50vh] lg:min-h-full landscape:md:col-span-1">
        <Card className="w-full h-full bg-black/90 relative overflow-hidden backdrop-blur-sm">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
            animate={{ scale: zoom / 100, rotate: rotation }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 1,
            }}
          >
            {showGrid && (
              <div
                className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30"
                style={{ borderColor: gridColor }}
              >
                {Array(144)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="border"
                      style={{ borderColor: gridColor }}
                    />
                  ))}
              </div>
            )}
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Preview"
              className="max-w-full max-h-full"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-4 right-4 space-y-2 bg-black/50 p-4 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label>缩放: {zoom}%</Label>
            <Slider
              min={50}
              max={200}
              step={1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
            />
            <Label>旋转: {rotation}°</Label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
            />
          </motion.div>
          <div className="absolute top-4 right-4 space-y-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowMeasurements(!showMeasurements)}
            >
              测量标尺
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowStars(!showStars)}
            >
              参考星等
            </Button>
          </div>
          {showMeasurements && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Add measurement overlay */}
            </div>
          )}
          {showStars && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Add reference stars */}
            </div>
          )}
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">设备详情</h3>
          <p className="text-sm text-muted-foreground">选中的设备详情如下。</p>
          <div className="mt-4 space-y-2">
            {selectedEquipmentDetails.map((eq) => (
              <motion.div
                key={eq.id}
                variants={itemVariants}
                className="p-2 bg-muted rounded-lg"
              >
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-full bg-red-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{eq.name}</span>
                      <Button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => deselectEquipment(eq.id)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {eq.type}: {eq.aperture}mm/{eq.focalLength}mm
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        f/{(eq.focalLength / eq.aperture).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
        <div className="flex gap-4">
          <Button className="flex-1" variant="secondary">
            保存图片
          </Button>
          <Button className="flex-1">分享视场</Button>
        </div>
      </div>
    </motion.div>
  );
}
