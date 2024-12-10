"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProfileTab } from "../../components/connection/ProfileTab";
import { DevicesTab } from "../../components/connection/DevicesTab";
import { AdvancedTab } from "../../components/connection/AdvancedTab";
import { LogsTab } from "../../components/connection/LogsTab";
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
      className="w-full max-w-4xl mx-auto h-full max-h-screen"
    >
      <Card className="h-full">
        <CardContent>
          <motion.div variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className={`grid w-full ${
                    isMobile ? "grid-cols-2 gap-2" : "grid-cols-4"
                  }`}
                >
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className={isMobile ? "col-span-1" : ""}
                  >
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className={isMobile ? "col-span-1" : ""}
                  >
                    Logs
                  </TabsTrigger>
                </TabsList>
                <AnimatePresence>
                  <motion.div variants={itemVariants}>
                    <TabsContent value="profile">
                      <ProfileTab toast={toast} />
                    </TabsContent>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <TabsContent value="devices">
                      <DevicesTab />
                    </TabsContent>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <TabsContent value="advanced">
                      <AdvancedTab />
                    </TabsContent>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <TabsContent value="logs">
                      <LogsTab />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  variants={itemVariants}
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <motion.span
                  variants={itemVariants}
                  className="text-sm font-medium"
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </motion.span>
              </div>
              <motion.div variants={itemVariants} className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Settings saved",
                      description:
                        "Your device connection settings have been updated.",
                    })
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("profile")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                {isConnected ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={handleConnect}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
