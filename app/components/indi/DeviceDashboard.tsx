import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDIDevice } from "@/types/indi";
import {
  Loader2,
  Power,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeviceDashboardProps {
  devices: INDIDevice[];
}

export const DeviceDashboard: React.FC<DeviceDashboardProps> = ({
  devices,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [selectedDevice, setSelectedDevice] = React.useState<INDIDevice | null>(
    null
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-4"
    >
      <motion.div
        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          设备仪表盘
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
            <span className="sr-only">
              {isOpen ? "关闭设备仪表盘" : "打开设备仪表盘"}
            </span>
          </Button>
        </CollapsibleTrigger>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device, index) => (
                <motion.div
                  key={device.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-50 dark:bg-gray-700">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {device.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {device.state === "Connected" && (
                          <Power className="h-5 w-5 text-green-500" />
                        )}
                        {device.state === "Disconnected" && (
                          <Power className="h-5 w-5 text-gray-500" />
                        )}
                        {device.state === "Connecting" && (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        )}
                        {device.state === "Error" && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-1">
                              <Info className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                              <span className="sr-only">查看详情</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="dark:bg-gray-800">
                            <DialogHeader>
                              <DialogTitle>{device.name} 详细信息</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p>
                                <strong>状态:</strong> {device.state}
                              </p>
                              <p>
                                <strong>属性数量:</strong>{" "}
                                {device.groups.reduce(
                                  (acc, group) => acc + group.properties.length,
                                  0
                                )}
                              </p>
                              <p>
                                <strong>分组数量:</strong>{" "}
                                {device.groups.length}
                              </p>
                              {/* 添加更多设备详细信息 */}
                            </div>
                            <Button
                              onClick={() => setSelectedDevice(null)}
                              className="mt-4 dark:bg-blue-600 dark:text-white"
                            >
                              关闭
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          状态:
                        </span>
                        {device.state === "Connected" && (
                          <Power className="h-5 w-5 text-green-500" />
                        )}
                        {device.state === "Disconnected" && (
                          <Power className="h-5 w-5 text-gray-500" />
                        )}
                        {device.state === "Connecting" && (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        )}
                        {device.state === "Error" && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          属性:
                        </span>
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {device.groups.reduce(
                            (acc, group) => acc + group.properties.length,
                            0
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          分组:
                        </span>
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {device.groups.length}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="dark:text-gray-200"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          刷新
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="dark:bg-gray-600 dark:text-white"
                        >
                          操作
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Collapsible>
  );
};
