"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProfileTab } from "@/components/connection/ProfileTab";
import { DevicesTab } from "@/components/connection/DevicesTab";
import { AdvancedTab } from "@/components/connection/AdvancedTab";
import { useApiService } from "@/services/connection";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DeviceConnection() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    useMock,
    toggleMockMode,
    fetchDevices,
    connectDevice,
    disconnectDevice,
  } = useApiService();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchDevices().then((devices) => {
      setIsConnected(devices.some((device) => device.connected));
    });
  }, [fetchDevices]);

  const handleConnect = async () => {
    toast({
      title: "Connecting to devices...",
      description: "Please wait while we establish the connection.",
    });
    try {
      const devices = await fetchDevices();
      for (const device of devices) {
        if (!device.connected) {
          await connectDevice(device.name);
        }
      }
      setIsConnected(true);
      toast({
        title: "Connected successfully!",
        description: "All devices are now online and ready.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "An error occurred while connecting to devices.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const devices = await fetchDevices();
      for (const device of devices) {
        if (device.connected) {
          await disconnectDevice(device.name);
        }
      }
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "All devices have been disconnected.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Disconnection failed",
        description: "An error occurred while disconnecting devices.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full mx-auto h-full max-h-screen"
    >
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-2">
          <motion.div variants={containerVariants}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 gap-1 p-0.5">
                <TabsTrigger value="profile" className="text-xs py-1">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="devices" className="text-xs py-1">
                  Devices
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs py-1">
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="logs" className="text-xs py-1">
                  Logs
                </TabsTrigger>
              </TabsList>

              <div className="mt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <TabsContent value="profile">
                      <ProfileTab toast={toast} />
                    </TabsContent>
                    <TabsContent value="devices">
                      <DevicesTab />
                    </TabsContent>
                    <TabsContent value="advanced">
                      <AdvancedTab />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>

            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center gap-2 pt-2 mt-2 border-t border-gray-800"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() =>
                    toast({
                      title: "Settings saved",
                      description:
                        "Your device connection settings have been updated.",
                    })
                  }
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setActiveTab("profile")}
                >
                  <X className="w-3 h-3 mr-1" />
                  Close
                </Button>

                {isConnected ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={handleConnect}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
