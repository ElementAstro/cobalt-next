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

import CameraViewfinder from "@/components/dashboard/camera-view";
import ExposureControls from "@/components/dashboard/right-sidebar";
import Sidebar from "@/components/dashboard/left-sidebar";
import TopBar from "@/components/dashboard/top-bar";
import Offcanvas from "@/components/dashboard/offcanvas";

import { CameraPage } from "@/components/dashboard/camera";
import { FocuserPage } from "@/components/dashboard/focuser";
import { FilterWheelPage } from "@/components/dashboard/filter-wheel";
import { TelescopePage } from "@/components/dashboard/telescope";

import SplashScreen from "@/components/custom/splash-screen";
import ErrorBoundary from "@/components/error/error-boundary";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
      id: "plugin",
      name: "Plugin",
      icon: "plug",
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
    {
      id: "tools",
      name: "Tools",
      icon: "tool",
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
    gain: 0,
    offset: 0,
    binning: "1x1",
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
  const [isServerConnected, setIsServerConnected] = useState(false);

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

        toast({
          title: "正在捕捉图像",
          description: `${
            burstMode ? "连拍" : "单张"
          }捕捉中，预计耗时 ${totalTime} 秒...`,
          variant: "default",
        });

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

            toast({
              title: "捕捉完成",
              description: `${burstMode ? "连拍" : "单张"}图像已成功捕捉！`,
              variant: "default",
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
      case "camera":
        return <CameraPage />;
      default:
        return null;
    }
  };

  const [agreed, setAgreed] = useState(false);
  const [language, setLanguage] = useState("en");


  const handleAgree = () => {
    setAgreed(true);
    // 这里可以添加用户同意后的其他逻辑
  };

  const handleDisagree = () => {
    // 这里可以添加用户不同意时的逻辑，比如显示一个提示或重定向到其他页面
    console.log("用户不同意协议");
  };

  const handleConnect = () => {
    setIsServerConnected(true);
  };

  return (
    <>
      <ErrorBoundary>
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
                    ></motion.div>
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
                  onLoadPreset={() => {}}
                  onSavePreset={() => {}}
                />
              </motion.div>
            </div>
          </div>
          <Offcanvas
            isOpen={offcanvasOpen}
            onClose={handleCloseOffcanvas}
            position="right"
            size="xl"
            backdrop={true}
            animation={{
              duration: 0.3,
              type: "slide",
            }}
            scrollBehavior="inside"
            className="p-4"
          >
            {offcanvasDevice && renderOffcanvasContent()}
          </Offcanvas>
          <Toaster />
        </DndContext>
      </ErrorBoundary>
    </>
  );
}
