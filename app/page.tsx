"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import CameraViewfinder from "./components/CameraViewfinder";
import ExposureControls from "./components/ExposureControls";
import DeviceToggle from "./components/DeviceToggle";
import DeviceWindow from "./components/DeviceWindow";
import ParameterAdjust from "./components/ParameterAdjust";
import { TopBar } from "./components/TopBar";
import { Offcanvas } from "./components/Offcanvas";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "./components/ImageGallery";
import { WeatherInfo } from "./components/WeatherInfo";
import { StarChart } from "./components/StarChart";
import { Sidebar } from "./components/Sidebar";
import { FocusAssistant } from "./components/FocusAssistant";
import { PolarAlignment } from "./components/PolarAlignment";
import { SequenceEditor } from "./components/SequenceEditor";
import { LiveStacking } from "./components/LiveStacking";

export default function CameraInterface() {
  type DeviceParams = {
    focalLength?: number;
    aperture?: number;
    tracking?: boolean;
    position?: number;
    speed?: number;
    rightAscension?: string;
    declination?: string;
    currentFilter?: string;
    availableFilters?: string[];
  };

  type Device = {
    id: string;
    name: string;
    icon: string;
    active: boolean;
    params: DeviceParams;
  };

  const [devices, setDevices] = useState<Device[]>([
    {
      id: "telescope",
      name: "Telescope",
      icon: "telescope",
      active: false,
      params: {
        focalLength: 1000,
        aperture: 200,
        tracking: false,
      },
    },
    {
      id: "focuser",
      name: "Focuser",
      icon: "focus",
      active: false,
      params: {
        position: 5000,
        speed: 100,
      },
    },
    {
      id: "mount",
      name: "Mount",
      icon: "compass",
      active: false,
      params: {
        rightAscension: "05h 34m 32s",
        declination: "-05° 27' 10\"",
        tracking: false,
      },
    },
    {
      id: "filterWheel",
      name: "Filter Wheel",
      icon: "filter",
      active: false,
      params: {
        currentFilter: "Clear",
        availableFilters: ["Clear", "Red", "Green", "Blue", "Luminance"],
      },
    },
    {
      id: "gallery",
      name: "Image Gallery",
      icon: "image",
      active: false,
      params: {},
    },
    {
      id: "weather",
      name: "Weather Info",
      icon: "cloud",
      active: false,
      params: {},
    },
    {
      id: "starChart",
      name: "Star Chart",
      icon: "star",
      active: false,
      params: {},
    },
    {
      id: "focusAssistant",
      name: "Focus Assistant",
      icon: "crosshair",
      active: false,
      params: {},
    },
    {
      id: "polarAlignment",
      name: "Polar Alignment",
      icon: "target",
      active: false,
      params: {},
    },
    {
      id: "sequenceEditor",
      name: "Sequence Editor",
      icon: "list",
      active: false,
      params: {},
    },
    {
      id: "liveStacking",
      name: "Live Stacking",
      icon: "layers",
      active: false,
      params: {},
    },
  ]);

  const [exposureSettings, setExposureSettings] = useState({
    shutterSpeed: "1/125",
    iso: "100",
    aperture: "f/2.8",
    focusPoint: "5000",
    filterType: "Clear",
    exposureTime: 10,
  });

  const [activeId, setActiveId] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(
    null
  );
  const [isShooting, setIsShooting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);
  const [offcanvasDevice, setOffcanvasDevice] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDevice = useCallback((id: string) => {
    setDevices((devices) =>
      devices.map((device) =>
        device.id === id
          ? { ...device, active: !device.active }
          : { ...device, active: false }
      )
    );
    setActiveDevice(id);
  }, []);

  const handleDragStart = useCallback(() => {
    // Add your logic for drag start here
  }, []);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleParameterClick = useCallback((parameter: string) => {
    setSelectedParameter((prevParam) =>
      prevParam === parameter ? null : parameter
    );
  }, []);

  const handleParameterChange = useCallback(
    (parameter: string, value: string) => {
      setExposureSettings((prev) => ({ ...prev, [parameter]: value }));
    },
    []
  );

  const handleDeviceParamChange = useCallback(
    (deviceId: string, param: string, value: any) => {
      setDevices((devices) =>
        devices.map((device) =>
          device.id === deviceId
            ? { ...device, params: { ...device.params, [param]: value } }
            : device
        )
      );
    },
    []
  );

  const handleCapture = useCallback(
    (exposureTime: number, burstMode: boolean) => {
      if (isShooting) {
        // Toggle pause/resume
        setIsPaused((prev) => !prev);
      } else {
        // Start a new capture
        setIsShooting(true);
        setIsPaused(false);
        setProgress(0);
        const captureCount = burstMode ? 3 : 1; // Assuming 3 shots for burst mode
        const totalTime = exposureTime * captureCount;
        const toastId = toast.loading(
          `Capturing ${
            burstMode ? "burst" : "image"
          } for ${totalTime} seconds...`
        );

        const startTime = Date.now();
        const updateProgress = () => {
          const elapsedTime = Date.now() - startTime;
          const newProgress = (elapsedTime / (totalTime * 1000)) * 100;
          setProgress(Math.min(newProgress, 100));

          if (newProgress < 100) {
            captureIntervalRef.current = setTimeout(updateProgress, 100);
          } else {
            setIsShooting(false);
            setProgress(0);
            toast.success(
              `${burstMode ? "Burst" : "Image"} captured successfully!`,
              { id: toastId }
            );
            // Simulate adding captured images
            setCapturedImages((prev) => [
              ...prev,
              ...Array(captureCount).fill(
                `/placeholder.svg?height=300&width=300`
              ),
            ]);
          }
        };

        updateProgress();
      }
    },
    [isShooting]
  );

  const handlePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleOpenOffcanvas = useCallback((device: string) => {
    setOffcanvasDevice(device);
    setOffcanvasOpen(true);
  }, []);

  const handleCloseOffcanvas = useCallback(() => {
    setOffcanvasOpen(false);
    setOffcanvasDevice(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
        <TopBar onOpenOffcanvas={handleOpenOffcanvas} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar devices={devices} onToggle={toggleDevice} />
          <div className="flex-1 relative overflow-hidden">
            <CameraViewfinder isShooting={isShooting} />
            <AnimatePresence>
              {activeDevice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeDevice === "gallery" && (
                    <ImageGallery
                      images={capturedImages}
                      onClose={() => setActiveDevice(null)}
                    />
                  )}
                  {activeDevice === "weather" && (
                    <WeatherInfo onClose={() => setActiveDevice(null)} />
                  )}
                  {activeDevice === "starChart" && (
                    <StarChart onClose={() => setActiveDevice(null)} />
                  )}
                  {activeDevice === "focusAssistant" && (
                    <FocusAssistant onClose={() => setActiveDevice(null)} />
                  )}
                  {activeDevice === "polarAlignment" && (
                    <PolarAlignment onClose={() => setActiveDevice(null)} />
                  )}
                  {activeDevice === "sequenceEditor" && (
                    <SequenceEditor onClose={() => setActiveDevice(null)} />
                  )}
                  {activeDevice === "liveStacking" && (
                    <LiveStacking onClose={() => setActiveDevice(null)} />
                  )}
                  {["telescope", "focuser", "mount", "filterWheel"].includes(
                    activeDevice
                  ) && (
                    <DeviceWindow
                      device={devices.find((d) => d.id === activeDevice)!}
                      onParamChange={handleDeviceParamChange}
                      onClose={() => setActiveDevice(null)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {selectedParameter && (
                <ParameterAdjust
                  parameter={selectedParameter}
                  value={String(
                    exposureSettings[
                      selectedParameter as keyof typeof exposureSettings
                    ]
                  )}
                  onChange={(value) =>
                    handleParameterChange(selectedParameter, value)
                  }
                  onClose={() => setSelectedParameter(null)}
                />
              )}
            </AnimatePresence>
          </div>
          <motion.div
            className="w-64 p-4 border-l border-gray-700"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ExposureControls
              settings={exposureSettings}
              onParameterClick={handleParameterClick}
              onCapture={handleCapture}
              onPause={handlePause}
              isShooting={isShooting}
              isPaused={isPaused}
              progress={progress}
            />
          </motion.div>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <DeviceWindow
            device={devices.find((d) => d.id === activeId)!}
            onParamChange={handleDeviceParamChange}
            onClose={() => {}}
          />
        ) : null}
      </DragOverlay>
      <Offcanvas
        isOpen={offcanvasOpen}
        onClose={handleCloseOffcanvas}
        title={
          offcanvasDevice
            ? devices.find((d) => d.id === offcanvasDevice)?.name || ""
            : ""
        }
      >
        {offcanvasDevice && (
          <div className="space-y-4">
            {Object.entries(
              devices.find((d) => d.id === offcanvasDevice)?.params || {}
            ).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium">{key}:</span>
                <span className="text-sm">{value.toString()}</span>
              </div>
            ))}
          </div>
        )}
      </Offcanvas>
      <Toaster />
    </DndContext>
  );
}
