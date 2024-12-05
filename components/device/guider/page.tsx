"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "../components/DeviceSelector";
import { motion } from "framer-motion";

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

export function GuiderPage() {
  const [ditherPixels, setDitherPixels] = useState("5");
  const [settleTimeout, setSettleTimeout] = useState("40");
  const { toast } = useToast();
  const { guiderInfo, startGuiding, stopGuiding, dither, setGuiderSettings } =
    useMockBackend();

  const handleStartGuiding = () => {
    startGuiding();
    toast({
      title: "Guiding Started",
      description: "The guider has started guiding.",
    });
  };

  const handleStopGuiding = () => {
    stopGuiding();
    toast({
      title: "Guiding Stopped",
      description: "The guider has stopped guiding.",
    });
  };

  const handleDither = () => {
    dither(parseInt(ditherPixels));
    toast({
      title: "Dithering",
      description: `Dithering by ${ditherPixels} pixels.`,
    });
  };

  const handleSettingsChange = () => {
    setGuiderSettings({
      ditherPixels: parseInt(ditherPixels),
      settleTimeout: parseInt(settleTimeout),
      showCorrections: guiderInfo.showCorrections,
    });
    toast({
      title: "Settings Updated",
      description: "Guider settings have been updated.",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-screen max-h-screen overflow-hidden bg-gray-900 text-white p-4 space-y-4"
    >
      <DeviceSelector
        deviceType="Guider"
        devices={[
          "ZWO ASI120MM Mini",
          "Starlight Xpress Lodestar X2",
          "QHY5L-II-M",
        ]}
        onDeviceChange={(device) => console.log(`Selected guider: ${device}`)}
      />
      <motion.div variants={itemVariants} className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Guider Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Pixel scale</Label>
                <div className="text-sm">{guiderInfo.pixelScale} arcsec/px</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>State</Label>
                <div className="text-sm">{guiderInfo.state}</div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2"
              >
                <Label htmlFor="show-corrections">Show Corrections</Label>
                <Switch
                  id="show-corrections"
                  checked={guiderInfo.showCorrections}
                  onCheckedChange={(checked) =>
                    setGuiderSettings({
                      ...guiderInfo,
                      showCorrections: checked,
                    })
                  }
                  className="bg-gray-700"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="dither-pixels">Dither pixels</Label>
                <Input
                  id="dither-pixels"
                  type="number"
                  value={ditherPixels}
                  onChange={(e) => setDitherPixels(e.target.value)}
                  placeholder="Enter pixels"
                  className="bg-gray-700 text-white"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="settle-timeout">Settle timeout</Label>
                <Input
                  id="settle-timeout"
                  type="number"
                  value={settleTimeout}
                  onChange={(e) => setSettleTimeout(e.target.value)}
                  placeholder="Enter timeout"
                  className="bg-gray-700 text-white"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phd2-profile">PHD2 profile</Label>
                <Select
                  defaultValue={guiderInfo.phd2Profile}
                  onValueChange={(value) =>
                    setGuiderSettings({
                      ...guiderInfo,
                      phd2Profile: value,
                    })
                  }
                >
                  <SelectTrigger
                    id="phd2-profile"
                    className="bg-gray-700 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleSettingsChange}
                className="w-full bg-gray-700 hover:bg-gray-600"
              >
                Apply Settings
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2 mt-4">
              <Label>Description</Label>
              <div className="text-sm">{guiderInfo.description}</div>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Guider Control</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleStartGuiding}
                  disabled={guiderInfo.state === "Guiding"}
                  className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600"
                >
                  Start Guiding
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  variant="destructive"
                  onClick={handleStopGuiding}
                  disabled={guiderInfo.state !== "Guiding"}
                  className="w-full sm:w-auto bg-red-700 hover:bg-red-600"
                >
                  Stop Guiding
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleDither}
                  disabled={guiderInfo.state !== "Guiding"}
                  className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600"
                >
                  Dither
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
