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
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { useMountStore } from "@/lib/store/device/telescope";
import styled from "styled-components";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Container = styled(motion.div)`
  color: white;
  background-color: #1f2937;
  min-height: 100vh;
  padding: 1rem;
`;

const StyledCard = styled(Card)`
  background-color: #374151;
  border-color: #4b5563;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

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

  const [trackingRate, setTrackingRate] = useState("1.0");
  const [pierSide, setPierSide] = useState<"East" | "West">("East");
  const [guideRate, setGuideRate] = useState("0.5");

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

  const handleSetTrackingRate = () => {
    toast({
      title: "追踪速率已更新",
      description: `速率设置为 ${trackingRate}x 恒星速率`,
    });
  };

  const handleFlipMeridian = () => {
    setPierSide((prev) => (prev === "East" ? "West" : "East"));
    toast({
      title: "子午线翻转",
      description: `转换到子午线${pierSide === "East" ? "西" : "东"}侧`,
    });
  };

  const mountStore = useMountStore();

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <DeviceSelector
        deviceType="Telescope"
        devices={["Celestron CGX", "Skywatcher EQ6-R", "iOptron CEM60"]}
        onDeviceChange={(device) =>
          console.log(`Selected telescope: ${device}`)
        }
      />
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <StyledCard>
          <CardHeader>
            <CardTitle>Telescope Information</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Site Latitude</Label>
                <Input
                  value={telescopeInfo.siteLatitude}
                  readOnly
                  className="text-white bg-gray-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Site Longitude</Label>
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
        </StyledCard>

        <StyledCard>
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
        </StyledCard>

        <StyledCard>
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
        </StyledCard>

        <StyledCard>
          <CardHeader>
            <CardTitle>高级控制</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>追踪速率</Label>
                <div className="flex gap-2">
                  <Input
                    value={trackingRate}
                    onChange={(e) => setTrackingRate(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={handleSetTrackingRate}>设置</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>导星速率</Label>
                <Select value={guideRate} onValueChange={setGuideRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">0.25x</SelectItem>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1.0">1.0x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>子午线侧</Label>
                <div className="flex gap-2">
                  <div>{pierSide}</div>
                  <Button onClick={handleFlipMeridian}>翻转</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Container>
  );
}
