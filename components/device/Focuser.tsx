"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { useFocuserStore } from "@/lib/store/device";
import styled from "styled-components";

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

export function FocuserPage() {
  const [inputPosition, setInputPosition] = useState("12500");
  const { toast } = useToast();
  const {
    targetPosition,
    temperatureCompensation,
    focuserInfo,
    setTargetPosition,
    setTemperatureCompensation,
    moveFocuser,
  } = useFocuserStore();

  const handleMove = (steps: number) => {
    moveFocuser(steps);
    toast({
      title: "Moving Focuser",
      description: `Moving focuser by ${steps} steps`,
    });
  };

  const handleMoveToPosition = () => {
    const position = parseInt(inputPosition);
    const steps = position - focuserInfo.position;
    moveFocuser(steps);
    toast({
      title: "Moving Focuser",
      description: `Moving focuser to position ${position}`,
    });
  };

  const handleTemperatureCompensation = (enabled: boolean) => {
    setTemperatureCompensation(enabled);
    toast({
      title: "Temperature Compensation",
      description: `Temperature compensation ${
        enabled ? "enabled" : "disabled"
      }`,
    });
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <DeviceSelector
        deviceType="Focuser"
        devices={["ZWO EAF", "Moonlite CSL", "Pegasus FocusCube2"]}
        onDeviceChange={(device) => console.log(`Selected focuser: ${device}`)}
      />
      <motion.div
        variants={itemVariants}
        className="mt-6 grid gap-4 lg:grid-cols-2"
      >
        <StyledCard>
          <CardHeader>
            <CardTitle>Focuser Information</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Position</Label>
                <div className="text-sm">{focuserInfo.position}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Temperature</Label>
                <div className="text-sm">{focuserInfo.temperature}°C</div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2"
              >
                <Label htmlFor="temp-comp">Temperature Compensation</Label>
                <Switch
                  id="temp-comp"
                  checked={temperatureCompensation}
                  onCheckedChange={handleTemperatureCompensation}
                />
              </motion.div>
            </motion.div>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardHeader>
            <CardTitle>Focuser Control</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Label htmlFor="target-position">Target Position</Label>
                <Input
                  id="target-position"
                  type="number"
                  value={inputPosition}
                  onChange={(e) => setInputPosition(e.target.value)}
                  className="max-w-[200px] text-black"
                />
                <Button onClick={handleMoveToPosition}>Move</Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-center gap-2"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(-1000)}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(-100)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(100)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="text-white"
                  onClick={() => handleMove(1000)}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Container>
  );
}
