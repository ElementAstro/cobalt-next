"use client";

import React from "react";
import { X, Cloud, Check, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useCloudStore } from "@/lib/store/filesystem";

interface CloudIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  availableServices?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  onConnect?: (service: string) => Promise<boolean>;
  onDisconnect?: (service: string) => Promise<boolean>;
}

export const CloudIntegration: React.FC<CloudIntegrationProps> = ({
  isOpen,
  onClose,
  availableServices = [
    {
      value: "google-drive",
      label: "Google Drive",
      icon: <Cloud className="w-5 h-5 mr-2" />,
    },
    {
      value: "dropbox",
      label: "Dropbox",
      icon: <Cloud className="w-5 h-5 mr-2" />,
    },
    {
      value: "onedrive",
      label: "OneDrive",
      icon: <Cloud className="w-5 h-5 mr-2" />,
    },
  ],
  onConnect,
  onDisconnect,
}) => {
  const {
    selectedService,
    setSelectedService,
    isConnected,
    setIsConnected,
    isLoading,
    setIsLoading,
    feedback,
    setFeedback,
  } = useCloudStore();

  const handleConnect = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      if (onConnect) {
        const success = await onConnect(selectedService);
        if (success) {
          setIsConnected(true);
          setFeedback({
            type: "success",
            message: `成功连接到 ${getServiceLabel(selectedService)}.`,
          });
        } else {
          throw new Error("连接失败");
        }
      } else {
        // 模拟连接逻辑
        console.log(`Connecting to ${selectedService}`);
        setTimeout(() => {
          setIsConnected(true);
          setFeedback({
            type: "success",
            message: `成功连接到 ${getServiceLabel(selectedService)}.`,
          });
          setIsLoading(false);
        }, 1500);
        return;
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: `连接到 ${getServiceLabel(selectedService)} 失败.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      if (onDisconnect) {
        const success = await onDisconnect(selectedService);
        if (success) {
          setIsConnected(false);
          setFeedback({
            type: "success",
            message: `已断开与 ${getServiceLabel(selectedService)} 的连接.`,
          });
        } else {
          throw new Error("断开失败");
        }
      } else {
        // 模拟断开逻辑
        console.log(`Disconnecting from ${selectedService}`);
        setTimeout(() => {
          setIsConnected(false);
          setFeedback({
            type: "success",
            message: `已断开与 ${getServiceLabel(selectedService)} 的连接.`,
          });
          setIsLoading(false);
        }, 1500);
        return;
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: `断开与 ${getServiceLabel(selectedService)} 的连接失败.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceLabel = (value: string) => {
    const service = availableServices.find((srv) => srv.value === value);
    return service ? service.label : value;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <motion.div
              className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4 shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      Cloud Integration
                    </span>
                    <DialogClose asChild>
                      <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                        <X className="w-6 h-6" />
                      </button>
                    </DialogClose>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label className="block mb-2 font-medium">
                  Select Cloud Service
                </Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger className="w-full p-2 rounded bg-gray-700 text-white">
                    <SelectValue placeholder="Select a cloud service" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.icon} {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {feedback && (
                <motion.div
                  className={`mb-4 flex items-center p-2 rounded ${
                    feedback.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {feedback.type === "success" ? (
                    <Check className="w-5 h-5 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2" />
                  )}
                  <span>{feedback.message}</span>
                </motion.div>
              )}

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isConnected ? (
                  <>
                    <p className="text-green-500 flex items-center mb-2">
                      <Check className="w-5 h-5 mr-2" />
                      Connected to {getServiceLabel(selectedService)}
                    </p>
                    <Button
                      onClick={handleDisconnect}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleConnect}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    <Cloud className="w-5 h-5 mr-2" />
                    {isLoading
                      ? "Connecting..."
                      : `Connect to ${getServiceLabel(selectedService)}`}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
