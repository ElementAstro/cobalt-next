"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Crosshair,
  Grid3X3,
  Save,
  Loader2,
  Camera,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface CameraViewfinderProps {
  isShooting: boolean;
}

interface Preset {
  name: string;
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  exposure: number;
  iso: number;
  whiteBalance: string;
}

export default function CameraViewfinder({
  isShooting,
}: CameraViewfinderProps) {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [exposure, setExposure] = useState(50);
  const [iso, setIso] = useState(100);
  const [whiteBalance, setWhiteBalance] = useState("Auto");
  const [showGrid, setShowGrid] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
  const viewfinderRef = useRef<HTMLDivElement>(null);

  // 加载预设
  useEffect(() => {
    const storedPresets = localStorage.getItem("cameraPresets");
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets));
    }
  }, []);

  // 保存预设
  useEffect(() => {
    localStorage.setItem("cameraPresets", JSON.stringify(presets));
  }, [presets]);

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

  const handleStartFocus = () => {
    // 可以在这里添加开始拍摄的逻辑
  };

  const handleStopFocus = () => {
    // 可以在这里添加停止拍摄的逻辑
  };

  const openPresetDialog = () => setIsPresetDialogOpen(true);
  const closePresetDialog = () => setIsPresetDialogOpen(false);

  const savePreset = () => {
    if (presetName.trim() === "") return;
    const newPreset: Preset = {
      name: presetName,
      zoom,
      brightness,
      contrast,
      saturation,
      rotation,
      exposure,
      iso,
      whiteBalance,
    };
    setPresets((prev) => [...prev, newPreset]);
    setPresetName("");
    closePresetDialog();
  };

  const loadPreset = (preset: Preset) => {
    setZoom(preset.zoom);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setRotation(preset.rotation);
    setExposure(preset.exposure);
    setIso(preset.iso);
    setWhiteBalance(preset.whiteBalance);
  };

  const resetSettings = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setExposure(50);
    setIso(100);
    setWhiteBalance("Auto");
    setFocusPoint({ x: 50, y: 50 });
  };

  const formatPresetActions = (preset: Preset) => (
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => loadPreset(preset)}>
        Load
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => {
          setPresets((prev) => prev.filter((p) => p.name !== preset.name));
        }}
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <TooltipProvider>
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
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
            }}
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
            aria-label="Focus Point"
          ></motion.div>
          {isShooting && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, times: [0, 0.1, 1] }}
              aria-hidden="true"
            ></motion.div>
          )}
        </motion.div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
                aria-label="Toggle Toolbar"
              >
                {isToolbarCollapsed ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Toolbar</TooltipContent>
          </Tooltip>
          <div
            className={`flex items-center justify-center gap-2 overflow-x-auto transition-all duration-300 ${
              isToolbarCollapsed ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
            }`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomOut}
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomIn}
                  aria-label="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleRotate}
                  aria-label="Rotate"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setShowGrid((grid) => !grid)}
                  aria-label="Toggle Grid"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setFocusPoint({ x: 50, y: 50 })}
                  aria-label="Reset Focus"
                >
                  <Crosshair className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Focus</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={resetSettings}
                  aria-label="Reset Settings"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Settings</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      aria-label="Save Preset"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Preset</TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {presets.map((preset) => (
                  <DropdownMenuItem
                    key={preset.name}
                    onSelect={() => loadPreset(preset)}
                  >
                    {preset.name}
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Manage Preset"
                          >
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </Button>
                        </DropdownMenuTrigger>
                        {formatPresetActions(preset)}
                      </DropdownMenu>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onSelect={openPresetDialog}>
                  Add New Preset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-2">
                  <Sun className="h-4 w-4" aria-hidden="true" />
                  <Slider
                    min={50}
                    max={150}
                    step={1}
                    value={[brightness]}
                    onValueChange={([value]) => setBrightness(value)}
                    className="w-24"
                    aria-label="Brightness"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Brightness</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-2">
                  <Sun className="h-4 w-4" aria-hidden="true" />
                  <Slider
                    min={50}
                    max={150}
                    step={1}
                    value={[contrast]}
                    onValueChange={([value]) => setContrast(value)}
                    className="w-24"
                    aria-label="Contrast"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Contrast</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-gray-800 rounded-md px-2">
                  <Sun className="h-4 w-4" aria-hidden="true" />
                  <Slider
                    min={50}
                    max={150}
                    step={1}
                    value={[saturation]}
                    onValueChange={([value]) => setSaturation(value)}
                    className="w-24"
                    aria-label="Saturation"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Saturation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="default"
                  onClick={handleStartFocus}
                  aria-label="Take Photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Take Photo</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* 预设保存对话框 */}
        <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Preset</DialogTitle>
              <DialogDescription>
                Enter a name for your preset.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Preset Name"
                aria-label="Preset Name"
              />
            </div>
            <DialogFooter className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={closePresetDialog}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={savePreset}
                disabled={presetName.trim() === ""}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
