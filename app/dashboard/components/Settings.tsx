// FILE: pages/settings.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Camera,
  HardDrive,
  Wifi,
  Settings as SettingsIcon,
} from "lucide-react";
import StorageSettings from "@/components/setting/StorageSettings";
import NetworkSettings from "@/components/setting/NetworkSettings";
import SystemManagement from "@/components/setting/SystemManagement";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("storage");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [cameraStates, setCameraStates] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [cameraResolutions, setCameraResolutions] = useState([
    "1080p",
    "1080p",
    "1080p",
    "1080p",
  ]);
  const [defaultStorage, setDefaultStorage] = useState("internal");
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 100 });

  const tabs = [
    {
      value: "storage",
      label: "存储设置",
      icon: <HardDrive className="h-4 w-4" />,
    },
    {
      value: "network",
      label: "网络设置",
      icon: <Wifi className="h-4 w-4" />,
    },
    {
      value: "system",
      label: "系统管理",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="p-4 md:p-3 flex flex-col gap-3 md:gap-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <motion.div>
            <TabsContent value="storage">
              <StorageSettings />
            </TabsContent>
            <TabsContent value="network">
              <NetworkSettings isDarkMode={isDarkMode} />
            </TabsContent>
            <TabsContent value="system">
              <SystemManagement isDarkMode={isDarkMode} />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
