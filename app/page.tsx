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

import { toast, Toaster } from "react-hot-toast";

import CameraViewfinder from "./components/CameraViewfinder";
import ExposureControls from "./components/ExposureControls";
import DeviceWindow from "./components/DeviceWindow";
import ParameterAdjust from "./components/ParameterAdjust";
import { TopBar } from "./components/TopBar";
import { Offcanvas } from "./components/Offcanvas";
import { ImageGallery } from "./components/ImageGallery";
import { WeatherInfo } from "./components/WeatherInfo";
import { Sidebar } from "./components/Sidebar";
import { FocusAssistant } from "./components/FocusAssistant";
import PolarAlignment from "./components/PolarAlignment";
import SequenceEditor from "./components/SequenceEditor";
import LiveStacking from "./components/LiveStacking";
import {DeviceConnection} from "./components/DeviceConnection";

import CameraPage from "./components/device/camera/page";
import FocuserPage from "./components/device/focuser/page";
import FilterWheelPage from "./components/device/filter-wheel/page";
import GuiderPage from "./components/device/guider/page";
import { TelescopePage } from "./components/device/telescope/page";

import LandscapeDetector from "@/components/landscape-detection";

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
    [key: string]: any;
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
      id: "device",
      name: "Device Connection",
      icon: "wifi",
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
    exposureMode: "Auto",
    whiteBalance: "Daylight",
  });

  const [activeId, setActiveId] = useState<string | null>(null);
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
    setActiveDevice((prev) => (prev === id ? null : id));
  }, []);

  const handleDragStart = useCallback(() => {
    // 添加拖拽开始逻辑
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
    (
      exposureTime: number,
      burstMode: boolean,
      exposureMode: string,
      whiteBalance: string
    ) => {
      if (isShooting) {
        // 切换暂停/恢复
        setIsPaused((prev) => !prev);
      } else {
        // 开始新的捕捉
        setIsShooting(true);
        setIsPaused(false);
        setProgress(0);
        const captureCount = burstMode ? 3 : 1; // 假设连拍模式下捕捉3张
        const totalTime = exposureTime * captureCount;
        const toastId = toast.loading(
          `正在捕捉${burstMode ? "连拍" : "图像"}，耗时 ${totalTime} 秒...`
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
            toast.success(`${burstMode ? "连拍" : "图像"}成功捕捉！`, {
              id: toastId,
            });
            // 模拟添加捕捉的图像
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

  const renderOffcanvasContent = () => {
    switch (offcanvasDevice) {
      case "telescope":
        return <TelescopePage />;
      case "focuser":
        return <FocuserPage />;
      case "filterWheel":
        return <FilterWheelPage />;
      case "guider":
        return <GuiderPage />;
      case "camera":
        return <CameraPage />;
      // 添加其他设备的页面组件
      default:
        return null;
    }
  };

  return (
    <LandscapeDetector
      aspectRatioThreshold={4 / 3}
      enableSound={true}
      persistPreference={true}
      forceFullscreen={true}
    >
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
              {!activeDevice && <CameraViewfinder isShooting={isShooting} />}
              <AnimatePresence>
                {activeDevice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeDevice === "device" && (
                      <DeviceConnection
                      />
                    )}
                    {activeDevice === "weather" && (
                      <WeatherInfo
                        apiKey="YOUR_API_KEY"
                        onClose={() => setActiveDevice(null)}
                      />
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
              className="w-20 border-l border-gray-700"
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
          {offcanvasDevice && renderOffcanvasContent()}
        </Offcanvas>
        <Toaster />
      </DndContext>
    </LandscapeDetector>
  );
}
