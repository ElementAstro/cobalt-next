"use client";

import styled from "styled-components";
import { useState } from "react";
import { Settings, RotateCcw, Power, StopCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useOrientation } from "@/hooks/use-orientation";
import { useRotatorStore } from "@/lib/store/device/rotation";

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

const Grid = styled(motion.div)`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FlexRow = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const FlexRowCentered = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function RotatorInterface() {
  const orientation = useOrientation();
  const {
    isMoving,
    reverse,
    mechanicalPosition,
    targetPosition,
    speed,
    mechanicalRange,
    minPosition,
    maxPosition,
    setReverse,
    setTargetPosition,
    setSpeed,
    setMechanicalRange,
    move,
    stop,
  } = useRotatorStore();

  const [presets, setPresets] = useState<number[]>([]);
  const [autoGuideCompensation, setAutoGuideCompensation] = useState(false);

  const savePreset = () => {
    setPresets([...presets, mechanicalPosition]);
  };

  const moveToPreset = (position: number) => {
    setTargetPosition(position);
    move();
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <StyledCard
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardHeader>
          <CardTitle>旋转器设置</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>机械位置</Label>
              <div className="text-sm">{mechanicalPosition.toFixed(1)}°</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>目标机械位置</Label>
              <Input
                type="number"
                value={targetPosition}
                onChange={(e) => setTargetPosition(Number(e.target.value))}
                min={minPosition}
                max={maxPosition}
                className="bg-gray-700 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>速度</Label>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                max={100}
                step={1}
              />
              <span className="text-sm text-gray-500">{speed}%</span>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>反转</Label>
              <Switch checked={reverse} onCheckedChange={setReverse} />
              <span>{reverse ? "ON" : "OFF"}</span>
            </motion.div>
          </Grid>
          <FlexRow>
            <motion.div variants={itemVariants}>
              <Button onClick={move} disabled={isMoving} className="sm:w-auto">
                移动
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                variant="destructive"
                onClick={stop}
                disabled={!isMoving}
                className="sm:w-auto"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                停止
              </Button>
            </motion.div>
          </FlexRow>
        </CardContent>
      </StyledCard>

      <StyledCard
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardHeader>
          <CardTitle>状态</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>是否移动</Label>
              <div className="text-sm">{isMoving ? "是" : "否"}</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>当前机械位置</Label>
              <div className="text-sm">{mechanicalPosition.toFixed(1)}°</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>目标机械位置</Label>
              <div className="text-sm">{targetPosition.toFixed(1)}°</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>速度</Label>
              <div className="text-sm">{speed}%</div>
            </motion.div>
          </Grid>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardHeader>
          <CardTitle>高级功能</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>导星补偿</Label>
              <Switch
                checked={autoGuideCompensation}
                onCheckedChange={setAutoGuideCompensation}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>位置预设</Label>
              <div className="flex gap-2 flex-wrap">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    onClick={() => moveToPreset(preset)}
                    variant="outline"
                    size="sm"
                  >
                    {preset.toFixed(1)}°
                  </Button>
                ))}
                <Button onClick={savePreset} variant="secondary" size="sm">
                  保存当前位置
                </Button>
              </div>
            </motion.div>
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
}
