"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDomeStore } from "@/lib/store/device/dome";
import { DeviceSelector } from "./DeviceSelector";
import { Power, RefreshCcw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { domeApi } from "@/services/device/dome";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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

export default function DomeInterface() {
  const {
    azimuth,
    shutterStatus,
    isConnected,
    isSynced,
    isSlewing,
    error,
    setAzimuth,
    setShutterStatus,
    setConnected,
    setSynced,
    setSlewing,
    setError,
  } = useDomeStore();

  const [targetAzimuth, setTargetAzimuth] = useState(azimuth);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTargetAzimuth(azimuth);
  }, [azimuth]);

  const handleAsyncOperation = async (
    operation: () => Promise<void>,
    successMessage: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await operation();
      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () =>
    handleAsyncOperation(
      () => domeApi.connect(),
      "Successfully connected to dome"
    );

  const handleDisconnect = () =>
    handleAsyncOperation(
      () => domeApi.disconnect(),
      "Successfully disconnected from dome"
    );

  const handleSlewToAzimuth = () =>
    handleAsyncOperation(
      () => domeApi.setAzimuth(targetAzimuth),
      `Successfully slewed to azimuth ${targetAzimuth}°`
    );

  const handleOpenShutter = () =>
    handleAsyncOperation(
      () => domeApi.openShutter(),
      "Shutter opened successfully"
    );

  const handleCloseShutter = () =>
    handleAsyncOperation(
      () => domeApi.closeShutter(),
      "Shutter closed successfully"
    );

  const handleSync = () =>
    handleAsyncOperation(() => domeApi.sync(), "Dome synced successfully");

  const handleFindHome = () =>
    handleAsyncOperation(() => domeApi.findHome(), "Dome found home position");

  const handleStop = () =>
    handleAsyncOperation(() => domeApi.stop(), "Dome stopped successfully");

  const handlePark = () =>
    handleAsyncOperation(() => domeApi.park(), "Dome parked successfully");

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <DeviceSelector
          deviceType="Dome"
          onDeviceChange={(device) => console.log(`Selected dome: ${device}`)}
        />

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>圆顶状态</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>方位角</Label>
                  <div className="text-sm">{azimuth}°</div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>快门状态</Label>
                  <div className="text-sm">{shutterStatus}</div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>连接状态</Label>
                  <div className="text-sm">
                    {isConnected ? "已连接" : "未连接"}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>同步状态</Label>
                  <div className="text-sm">
                    {isSynced ? "已同步" : "未同步"}
                  </div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle>圆顶控制</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div variants={containerVariants} className="space-y-8">
                <motion.div variants={itemVariants} className="space-y-4">
                  <Label>方位角控制</Label>
                  <div className="flex space-x-4">
                    <Input
                      type="number"
                      value={targetAzimuth}
                      onChange={(e) => setTargetAzimuth(Number(e.target.value))}
                      className="flex-1 bg-gray-700"
                    />
                    <Button
                      onClick={handleSlewToAzimuth}
                      disabled={!isConnected || isSlewing || isLoading}
                      className="relative"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "翘曲"
                      )}
                    </Button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex space-x-4">
                  <Button
                    className="flex-1"
                    onClick={handleOpenShutter}
                    disabled={!isConnected || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "打开快门"
                    )}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCloseShutter}
                    disabled={!isConnected || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "关闭快门"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>高级设置</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={containerVariants} className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2"
              >
                <Label>跟随望远镜</Label>
                <Switch
                  checked={isSynced}
                  onCheckedChange={handleSync}
                  disabled={!isConnected || isLoading}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <Button
                  onClick={handleFindHome}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "寻找归位"
                  )}
                </Button>
                <Button
                  onClick={handlePark}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "停靠"
                  )}
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "停止"
                  )}
                </Button>
                <Button
                  onClick={handleSync}
                  disabled={!isConnected || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "同步"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
