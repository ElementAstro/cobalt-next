"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RefreshCw,
  Search,
  Power,
  Moon,
  Sun,
  Download,
  Upload,
} from "lucide-react";
import {
  INDIPanelProps,
  INDIDevice,
  INDIGroup,
  DeviceState,
  FilterOptions,
} from "@/types/indi";
import { PropertyControl } from "./PropertyControl";
import { toast } from "@/hooks/use-toast";
import { LineChart } from "./LineChart";
import { AdvancedFilter } from "./AdvancedFilter";
import { DeviceDashboard } from "./DeviceDashboard";
import { motion, AnimatePresence } from "framer-motion";

export function INDIPanel({
  devices,
  onPropertyChange,
  onRefresh,
  onConnect,
  onDisconnect,
  onExportConfig,
  onImportConfig,
}: INDIPanelProps) {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    searchTerm: "",
    propertyTypes: [],
    propertyStates: [],
    groups: [],
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const handlePropertyChange = async (
    deviceName: string,
    propertyName: string,
    value: string | number | boolean
  ) => {
    try {
      await onPropertyChange(deviceName, propertyName, value);
      addLog(`Changed ${deviceName}.${propertyName} to ${value}`);
    } catch (error) {
      addLog(`Failed to change ${deviceName}.${propertyName} to ${value}`);
      toast({
        title: "Error",
        description: `Failed to change ${propertyName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async (deviceName: string, propertyName?: string) => {
    try {
      await onRefresh(deviceName, propertyName);
      addLog(
        `Refreshed ${deviceName}${propertyName ? `.${propertyName}` : ""}`
      );
    } catch (error) {
      addLog(
        `Failed to refresh ${deviceName}${
          propertyName ? `.${propertyName}` : ""
        }`
      );
      toast({
        title: "Error",
        description: `Failed to refresh ${deviceName}${
          propertyName ? `.${propertyName}` : ""
        }. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleConnect = async (deviceName: string) => {
    try {
      await onConnect(deviceName);
      addLog(`Connected to ${deviceName}`);
    } catch (error) {
      addLog(`Failed to connect to ${deviceName}`);
      toast({
        title: "Error",
        description: `Failed to connect to ${deviceName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (deviceName: string) => {
    try {
      await onDisconnect(deviceName);
      addLog(`Disconnected from ${deviceName}`);
    } catch (error) {
      addLog(`Failed to disconnect from ${deviceName}`);
      toast({
        title: "Error",
        description: `Failed to disconnect from ${deviceName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleExportConfig = async (deviceName: string) => {
    try {
      await onExportConfig(deviceName);
      addLog(`Exported configuration for ${deviceName}`);
      toast({
        title: "Success",
        description: `Configuration for ${deviceName} has been exported.`,
      });
    } catch (error) {
      addLog(`Failed to export configuration for ${deviceName}`);
      toast({
        title: "Error",
        description: `Failed to export configuration for ${deviceName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleImportConfig = async (deviceName: string, config: string) => {
    try {
      await onImportConfig(deviceName, config);
      addLog(`Imported configuration for ${deviceName}`);
      toast({
        title: "Success",
        description: `Configuration for ${deviceName} has been imported.`,
      });
    } catch (error) {
      addLog(`Failed to import configuration for ${deviceName}`);
      toast({
        title: "Error",
        description: `Failed to import configuration for ${deviceName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const renderDeviceStateButton = (device: INDIDevice) => {
    switch (device.state) {
      case "Disconnected":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConnect(device.name)}
          >
            <Power className="w-4 h-4 mr-2" />
            Connect
          </Button>
        );
      case "Connected":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDisconnect(device.name)}
          >
            <Power className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        );
      case "Connecting":
        return (
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </Button>
        );
      case "Error":
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleConnect(device.name)}
          >
            <Power className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        );
    }
  };

  const renderDevice = (device: INDIDevice) => (
    <TabsContent key={device.name} value={device.name} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{device.name}</h2>
        <div className="flex gap-2">
          {renderDeviceStateButton(device)}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefresh(device.name)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportConfig(device.name)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleImportConfig(device.name, "")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Config
          </Button>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {device.groups.map((group) => renderGroup(device.name, group))}
      </Accordion>
    </TabsContent>
  );

  const renderGroup = (deviceName: string, group: INDIGroup) => {
    const filteredProperties = group.properties.filter(
      (prop) =>
        (filterOptions.searchTerm === "" ||
          prop.name
            .toLowerCase()
            .includes(filterOptions.searchTerm.toLowerCase()) ||
          prop.label
            .toLowerCase()
            .includes(filterOptions.searchTerm.toLowerCase())) &&
        (filterOptions.propertyTypes.length === 0 ||
          filterOptions.propertyTypes.includes(prop.type)) &&
        (filterOptions.propertyStates.length === 0 ||
          filterOptions.propertyStates.includes(prop.state)) &&
        (filterOptions.groups.length === 0 ||
          filterOptions.groups.includes(group.name))
    );

    if (filteredProperties.length === 0) return null;

    return (
      <AccordionItem key={group.name} value={group.name}>
        <AccordionTrigger>{group.name}</AccordionTrigger>
        <AccordionContent>
          <AnimatePresence>
            {filteredProperties.map((property) => (
              <motion.div
                key={property.name}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyControl
                  deviceName={deviceName}
                  property={property}
                  onChange={handlePropertyChange}
                  onRefresh={handleRefresh}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const allGroups = React.useMemo(() => {
    const groups = new Set<string>();
    devices.forEach((device) => {
      device.groups.forEach((group) => {
        groups.add(group.name);
      });
    });
    return Array.from(groups);
  }, [devices]);

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      <Card className="max-w-[1200px] mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">INDI Control Panel</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              >
                <Search className="w-4 h-4 mr-2" />
                {showAdvancedFilter ? "Hide" : "Show"} Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <DeviceDashboard devices={devices} />

          {showAdvancedFilter && (
            <div className="mb-4">
              <AdvancedFilter
                options={filterOptions}
                onChange={setFilterOptions}
                groups={allGroups}
              />
            </div>
          )}

          <Tabs defaultValue={devices[0]?.name} className="space-y-4">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="w-full justify-start">
                {devices.map((device) => (
                  <TabsTrigger key={device.name} value={device.name}>
                    {device.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {devices.map(renderDevice)}
          </Tabs>

          {/* Logs Section */}
          <div className="mt-6 border rounded-lg">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setLogs([])}>
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
