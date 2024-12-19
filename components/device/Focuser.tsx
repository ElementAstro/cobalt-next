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
import { useFocuserStore } from "@/lib/store/device/focuser";
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ControlButton = styled(Button)`
  min-width: 48px;
  height: 48px;
  
  @media (min-width: 640px) {
    min-width: 64px;
    height: 64px;
  }
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
  const [autoFocusing, setAutoFocusing] = useState(false);
  const [tempCompCurve, setTempCompCurve] = useState<[number, number][]>([]);

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

  const startAutoFocus = () => {
    setAutoFocusing(true);
    // 实现自动对焦逻辑
  };

  const addTempCompPoint = () => {
    setTempCompCurve([
      ...tempCompCurve,
      [focuserInfo.temperature, focuserInfo.position],
    ]);
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <div className="max-w-7xl mx-auto space-y-6">
        <DeviceSelector
          deviceType="Focuser"
          devices={["ZWO EAF", "Moonlite CSL", "Pegasus FocusCube2"]}
          onDeviceChange={(device) => console.log(`Selected focuser: ${device}`)}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
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
                className="space-y-8"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col space-y-4"
                >
                  <Label htmlFor="target-position">Target Position</Label>
                  <div className="flex space-x-4">
                    <Input
                      id="target-position"
                      type="number"
                      value={inputPosition}
                      onChange={(e) => setInputPosition(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleMoveToPosition} className="whitespace-nowrap">
                      Move To
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-4"
                >
                  <ControlButton variant="secondary" onClick={() => handleMove(-1000)}>
                    <ChevronFirst className="h-6 w-6" />
                  </ControlButton>
                  <ControlButton
                    variant="secondary"
                    size="icon"
                    className="text-white"
                    onClick={() => handleMove(-100)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </ControlButton>
                  <ControlButton
                    variant="secondary"
                    size="icon"
                    className="text-white"
                    onClick={() => handleMove(100)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </ControlButton>
                  <ControlButton
                    variant="secondary"
                    size="icon"
                    className="text-white"
                    onClick={() => handleMove(1000)}
                  >
                    <ChevronLast className="h-4 w-4" />
                  </ControlButton>
                </motion.div>
              </motion.div>
            </CardContent>
          </StyledCard>
        </div>
      </div>

      <StyledCard>
        <CardHeader>
          <CardTitle>自动对焦</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div variants={itemVariants} className="space-y-4">
            <Button onClick={startAutoFocus} disabled={autoFocusing}>
              {autoFocusing ? "对焦中..." : "开始自动对焦"}
            </Button>

            <div className="space-y-2">
              <Label>温度补偿曲线</Label>
              <Button onClick={addTempCompPoint} variant="outline">
                添加当前点
              </Button>
              {tempCompCurve.map((point, index) => (
                <div key={index} className="text-sm">
                  {point[0].toFixed(1)}°C @ {point[1]}步
                </div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </StyledCard>
    </Container>
  );
}
