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

import CameraViewfinder from "../components/CameraViewfinder";
import ExposureControls from "../components/ExposureControls";
import DeviceWindow from "../components/DeviceWindow";
import ParameterAdjust from "../components/ParameterAdjust";
import { TopBar } from "../components/TopBar";
import { Offcanvas } from "../../components/Offcanvas";
import { Sidebar } from "../components/Sidebar";
import FocusAssistant from "../components/FocusAssistant";
import SequenceEditor from "../components/SequenceEditor";
import DeviceConnection from "../components/DeviceConnection";
import PluginPage from "../components/Plugin";
import StarSearch from "../components/StarSearch";
import ToolPanel from "../components/ToolPanel";
import SettingsPage from "../components/Settings";

import { CameraPage } from "../../components/device/camera/page";
import { FocuserPage } from "../../components/device/focuser/page";
import { FilterWheelPage } from "../../components/device/filter-wheel/page";
import { GuiderPage } from "../../components/device/guider/page";
import { TelescopePage } from "../../components/device/telescope/page";

import Log from "../components/Log";
import AuthorInfo from "../components/AuthorInfo";

import LandscapeDetector from "@/components/LandscapeDetection";
import SplashScreen from "../../components/loading/SplashScreen";
import ConnectionForm from "@/components/server/ConnectionForm";
import { UserAgreementMask } from "@/components/UserAgreementMask";

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
      case "Logs":
        return <Log />;
      case "Settings":
        return <SettingsPage />;
      case "Info":
        return <AuthorInfo />;
      default:
        return null;
    }
  };

  const [agreed, setAgreed] = useState(false);
  const [language, setLanguage] = useState("en");

  const agreementText = {
    en: `
      This is a sample user agreement. In actual use, you should place your full user agreement content here.
      
      1. Terms of Service: This agreement is a legal agreement between you and us regarding the use of our services.
      2. User Obligations: You agree to comply with all applicable laws and regulations.
      3. Intellectual Property: Our services and content are protected by intellectual property laws.
      4. Disclaimer: We are not responsible for any losses resulting from the use of our services.
      5. Agreement Modification: We reserve the right to modify this agreement at any time.
      
      Please read the above terms carefully. If you agree, please click the "Agree and Continue" button.
    `,
    zh: `
      这是一个示例用户协议。在实际使用时，您应该在这里放置您的完整用户协议内容。
      
      1. 服务条款：本协议是您与我们之间关于使用我们服务的法律协议。
      2. 用户义务：您同意遵守所有适用的法律和法规。
      3. 知识产权：我们的服务和内容受知识产权法保护。
      4. 免责声明：我们不对因使用我们的服务而导致的任何损失负责。
      5. 协议修改：我们保留随时修改本协议的权利。
      
      请仔细阅读以上条款。如果您同意，请点击"同意并继续"按钮。
    `,
  };

  const privacyPolicyText = {
    en: `
      This is a sample privacy policy. In actual use, you should place your full privacy policy content here.
      
      1. Information Collection: We collect information you provide to us and information automatically generated when you use our services.
      2. Information Use: We use the collected information to provide, maintain, and improve our services.
      3. Information Sharing: We do not sell your personal information. In certain circumstances, we may share information with third parties.
      4. Data Security: We take reasonable measures to protect your personal information.
      5. Your Rights: You have the right to access, correct, or delete your personal information.
      
      Please read the above privacy policy carefully. If you agree, please click the "Agree and Continue" button.
    `,
    zh: `
      这是一个示例隐私政策。在实际使用时，您应该在这里放置您的完整隐私政策内容。
      
      1. 信息收集：我们收集您提供给我们的信息，以及您使用我们服务时自动生成的信息。
      2. 信息使用：我们使用收集到的信息来提供、维护和改进我们的服务。
      3. 信息共享：我们不会出售您的个人信息。在某些情况下，我们可能会与第三方共享信息。
      4. 数据安全：我们采取合理的措施来保护您的个人信息。
      5. 您的权利：您有权访问、更正或删除您的个人信息。
      
      请仔细阅读以上隐私政策。如果您同意，请点击"同意并继续"按钮。
    `,
  };

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
      <LandscapeDetector
        aspectRatioThreshold={4 / 3}
        enableSound={true}
        persistPreference={true}
        forceFullscreen={true}
      >
        <SplashScreen />
        {!isServerConnected ? (
          <ConnectionForm onConnect={handleConnect} />
        ) : (
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
                  {!activeDevice && (
                    <CameraViewfinder isShooting={isShooting} />
                  )}
                  <AnimatePresence>
                    {activeDevice && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeDevice === "device" && <DeviceConnection />}
                        {activeDevice === "plugin" && <PluginPage />}
                        {activeDevice === "starChart" && <StarSearch />}
                        {activeDevice === "focusAssistant" && (
                          <FocusAssistant
                            onClose={() => setActiveDevice(null)}
                          />
                        )}
                        {activeDevice === "sequenceEditor" && (
                          <SequenceEditor
                            onClose={() => setActiveDevice(null)}
                          />
                        )}
                        {activeDevice === "liveStacking" && <ToolPanel />}
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
        )}
      </LandscapeDetector>
      <UserAgreementMask
        agreementText={agreementText}
        privacyPolicyText={privacyPolicyText}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
        language={language}
        version="1.0"
        requireReadConfirmation={true}
        allowPrint={true}
      />
    </>
  );
}
