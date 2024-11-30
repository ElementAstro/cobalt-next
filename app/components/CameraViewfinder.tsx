import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Crosshair,
  Grid3X3,
} from "lucide-react";

interface CameraViewfinderProps {
  isShooting: boolean;
}

export default function CameraViewfinder({
  isShooting,
}: CameraViewfinderProps) {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const viewfinderRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(
    () => setZoom((z) => Math.min(z + 0.1, 3)),
    []
  );
  const handleZoomOut = useCallback(
    () => setZoom((z) => Math.max(z - 0.1, 0.5)),
    []
  );
  const handleRotate = useCallback(
    () => setRotation((r) => (r + 90) % 360),
    []
  );

  const handleViewfinderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (viewfinderRef.current) {
        const rect = viewfinderRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setFocusPoint({ x, y });
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "g") setShowGrid((grid) => !grid);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        ref={viewfinderRef}
        className="relative w-full h-full max-w-4xl max-h-4xl cursor-crosshair"
        onClick={handleViewfinderClick}
        animate={{ scale: zoom, rotate: rotation }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="absolute inset-0 bg-black"
          style={{ filter: `brightness(${brightness}%)` }}
        ></div>
        <div className="absolute inset-4 md:inset-8 border-2 border-white opacity-50 rounded-lg"></div>
        <AnimatePresence>
          {showGrid && (
            <motion.div
              className="absolute inset-0 grid grid-cols-3 grid-rows-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white"></div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute w-8 h-8 border-2 border-red-500 rounded-full"
          animate={{ x: `${focusPoint.x}%`, y: `${focusPoint.y}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ transform: "translate(-50%, -50%)" }}
        ></motion.div>
        {isShooting && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.1, 1] }}
          ></motion.div>
        )}
      </motion.div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleRotate}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setShowGrid((grid) => !grid)}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-2">
          <Sun className="h-4 w-4" />
          <Slider
            min={50}
            max={150}
            step={1}
            value={[brightness]}
            onValueChange={([value]) => setBrightness(value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
