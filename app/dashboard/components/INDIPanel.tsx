"use client";

import { useState, useEffect } from "react";
import { INDIPanel } from "@/components/indi/INDIPanel";
import { INDIDevice } from "@/types/indi";
import { Toaster } from "@/components/ui/toaster";
import { initialDevices } from "@/utils/mock-indi";

export default function AllINDIPanel() {
  const [devices, setDevices] = useState<INDIDevice[]>(initialDevices);

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => ({
          ...device,
          groups: device.groups.map((group) => ({
            ...group,
            properties: group.properties.map((prop) => {
              if (prop.type === "number" && prop.history) {
                const newValue =
                  Math.random() * (prop.max! - prop.min!) + prop.min!;
                return {
                  ...prop,
                  value: newValue,
                  history: [
                    ...prop.history,
                    { timestamp: new Date(), value: newValue },
                  ].slice(-20),
                };
              }
              return prop;
            }),
          })),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePropertyChange = async (
    deviceName: string,
    propertyName: string,
    value: string | number | boolean
  ) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceName
          ? {
              ...device,
              groups: device.groups.map((group) => ({
                ...group,
                properties: group.properties.map((prop) =>
                  prop.name === propertyName
                    ? { ...prop, value, state: "Ok" }
                    : prop
                ),
              })),
            }
          : device
      )
    );
  };

  const handleRefresh = async (deviceName: string, propertyName?: string) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceName
          ? {
              ...device,
              groups: device.groups.map((group) => ({
                ...group,
                properties: group.properties.map((prop) =>
                  !propertyName || prop.name === propertyName
                    ? { ...prop, state: "Ok" }
                    : prop
                ),
              })),
            }
          : device
      )
    );
  };

  const handleConnect = async (deviceName: string) => {
    // Simulate connection process
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceName ? { ...device, state: "Connecting" } : device
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceName ? { ...device, state: "Connected" } : device
      )
    );
  };

  const handleDisconnect = async (deviceName: string) => {
    // Simulate disconnection process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.name === deviceName
          ? { ...device, state: "Disconnected" }
          : device
      )
    );
  };

  const handleExportConfig = async (deviceName: string) => {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Exporting configuration for ${deviceName}`);
  };

  const handleImportConfig = async (deviceName: string, config: string) => {
    // Simulate import process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Importing configuration for ${deviceName}: ${config}`);
  };

  return (
    <>
      <INDIPanel
        devices={devices}
        onPropertyChange={handlePropertyChange}
        onRefresh={handleRefresh}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />
      <Toaster />
    </>
  );
}
