import React, { useState } from "react";
import { X, Cloud, Check } from "lucide-react";
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

interface CloudIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export const CloudIntegration: React.FC<CloudIntegrationProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [selectedService, setSelectedService] = useState<
    "google-drive" | "dropbox" | "onedrive"
  >("google-drive");
  const [isConnected, setIsConnected] = useState(false);

  if (!isOpen) return null;

  const handleConnect = () => {
    // Implement actual cloud service connection logic here
    console.log(`Connecting to ${selectedService}`);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    // Implement actual cloud service disconnection logic here
    console.log(`Disconnecting from ${selectedService}`);
    setIsConnected(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <DialogContent
            className={`${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } p-6 rounded-lg max-w-md w-full mx-4`}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Cloud Integration</span>
                  <DialogClose asChild>
                    <button className="p-1 rounded-full hover:bg-gray-700 transition duration-200">
                      <X className="w-6 h-6" />
                    </button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <Label className="block mb-2 font-medium">
                  Select Cloud Service
                </Label>
                <select
                  value={selectedService}
                  onChange={(e) =>
                    setSelectedService(
                      e.target.value as "google-drive" | "dropbox" | "onedrive"
                    )
                  }
                  className={`w-full p-2 rounded ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <option value="google-drive">Google Drive</option>
                  <option value="dropbox">Dropbox</option>
                  <option value="onedrive">OneDrive</option>
                </select>
              </div>
              {isConnected ? (
                <div className="mb-4">
                  <p className="text-green-500 flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Connected to {selectedService}
                  </p>
                  <Button
                    onClick={handleDisconnect}
                    className={`mt-2 w-full py-2 px-4 ${
                      theme === "dark"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white rounded-lg transition duration-200`}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleConnect}
                  className={`w-full py-2 px-4 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg transition duration-200`}
                >
                  <Cloud className="w-5 h-5 inline-block mr-2" />
                  Connect to {selectedService}
                </Button>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
