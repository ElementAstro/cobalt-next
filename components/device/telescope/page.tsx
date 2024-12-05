"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  ParkingSquare,
} from "lucide-react";
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

export function TelescopePage() {
  const [targetRA, setTargetRA] = useState("00:00:00");
  const [targetDec, setTargetDec] = useState("00:00:00");
  const { toast } = useToast();
  const {
    telescopeInfo,
    moveTelescopeManual,
    slewToCoordinates,
    parkTelescope,
    homeTelescope,
  } = useMockBackend();

  const handleManualMove = (direction: string) => {
    moveTelescopeManual(direction);
    toast({
      title: "Telescope Moving",
      description: `Moving telescope ${direction}`,
    });
  };

  const handleSlew = () => {
    slewToCoordinates(targetRA, targetDec);
    toast({
      title: "Slewing Telescope",
      description: `Slewing to RA: ${targetRA}, Dec: ${targetDec}`,
    });
  };

  const handlePark = () => {
    parkTelescope();
    toast({
      title: "Parking Telescope",
      description: "Telescope is being parked",
    });
  };

  const handleHome = () => {
    homeTelescope();
    toast({
      title: "Homing Telescope",
      description: "Telescope is moving to home position",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 p-4 text-white"
    >
      <DeviceSelector
        deviceType="Telescope"
        devices={["Celestron CGX", "Skywatcher EQ6-R", "iOptron CEM60"]}
        onDeviceChange={(device) =>
          console.log(`Selected telescope: ${device}`)
        }
      />
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Telescope Information</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Site latitude</Label>
                <Input
                  value={telescopeInfo.siteLatitude}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Site longitude</Label>
                <Input
                  value={telescopeInfo.siteLongitude}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Right Ascension</Label>
                <Input
                  value={telescopeInfo.rightAscension}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Declination</Label>
                <Input
                  value={telescopeInfo.declination}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Altitude</Label>
                <Input
                  value={telescopeInfo.altitude}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Azimuth</Label>
                <Input
                  value={telescopeInfo.azimuth}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Manual Control</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-2 max-w-[240px] w-full"
              >
                <div />
                <Button
                  variant="secondary"
                  size="icon"
                  className="aspect-square text-white"
                  onClick={() => handleManualMove("up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  variant="secondary"
                  size="icon"
                  className="aspect-square text-white"
                  onClick={() => handleManualMove("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="aspect-square text-white"
                  onClick={() => handleManualMove("stop")}
                >
                  Stop
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="aspect-square text-white"
                  onClick={() => handleManualMove("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  variant="secondary"
                  size="icon"
                  className="aspect-square text-white"
                  onClick={() => handleManualMove("down")}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-2 mt-4 w-full"
              >
                <Button
                  variant="secondary"
                  className="w-full sm:w-24 text-white"
                  onClick={handlePark}
                >
                  <ParkingSquare className="mr-2 h-4 w-4" />
                  Park
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-24 text-white"
                  onClick={handleHome}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Slew to Coordinates</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="target-ra">Target RA</Label>
                <Input
                  id="target-ra"
                  value={targetRA}
                  onChange={(e) => setTargetRA(e.target.value)}
                  placeholder="HH:MM:SS"
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="target-dec">Target Dec</Label>
                <Input
                  id="target-dec"
                  value={targetDec}
                  onChange={(e) => setTargetDec(e.target.value)}
                  placeholder="DD:MM:SS"
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-end">
                <Button
                  onClick={handleSlew}
                  className="w-full sm:w-auto text-white"
                >
                  Slew
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
