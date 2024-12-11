"use client";

import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "@/components/chart/TemperatureLineChart";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { useCameraStore, TempDataPoint } from "@/lib/store/device";

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #1f2937;
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

export function CameraPage() {
  const {
    exposure,
    gain,
    binning,
    coolerOn,
    targetTemperature,
    temperatureHistory,
    setExposure,
    setGain,
    setBinning,
    toggleCooler,
    setTargetTemperature,
    addTemperatureHistory,
  } = useCameraStore();

  const { toast } = useToast();
  const {
    cameraInfo,
    startExposure,
    abortExposure,
    setTemperature,
    toggleCooler: mockToggleCooler,
  } = useMockBackend();

  const handleStartExposure = () => {
    startExposure(exposure, gain, binning);
    toast({
      title: "开始曝光",
      description: `曝光时间: ${exposure}s, 增益: ${gain}, 像素合并: ${binning}x${binning}`,
    });
  };

  const handleAbortExposure = () => {
    abortExposure();
    toast({
      title: "中止曝光",
      description: "当前曝光已被中止。",
    });
  };

  const handleSetTemperature = () => {
    setTemperature(targetTemperature);
    toast({
      title: "设置温度",
      description: `目标温度已设置为 ${targetTemperature}°C`,
    });
  };

  const handleToggleCooler = () => {
    toggleCooler();
    mockToggleCooler();
    toast({
      title: "切换制冷器",
      description: `制冷器已${coolerOn ? "启用" : "禁用"}`,
    });
  };

  const handleZoomIn = () => {
    // 实现缩放逻辑
  };

  const handleZoomOut = () => {
    // 实现缩放逻辑
  };

  return (
    <Container>
      <DeviceSelector
        deviceType="Camera"
        devices={["ZWO ASI294MC Pro", "QHY600M", "Atik 16200"]}
        onDeviceChange={(device) => console.log(`选择的相机: ${device}`)}
      />
      <StyledCard
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardHeader>
          <CardTitle>相机设置</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>传感器类型</Label>
              <div className="text-sm">{cameraInfo.sensorType}</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>传感器尺寸</Label>
              <div className="text-sm">{cameraInfo.sensorSize}</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>像素尺寸</Label>
              <div className="text-sm">{cameraInfo.pixelSize}</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>温度</Label>
              <div className="text-sm">{cameraInfo.temperature}°C</div>
            </motion.div>
          </Grid>
        </CardContent>
      </StyledCard>

      <StyledCard
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardHeader>
          <CardTitle>曝光控制</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="exposure">曝光时间 (秒)</Label>
              <Input
                id="exposure"
                type="number"
                value={exposure}
                onChange={(e) => setExposure(parseFloat(e.target.value))}
                min="0.001"
                step="0.001"
                className="bg-gray-700 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="gain">增益</Label>
              <Input
                id="gain"
                type="number"
                value={gain}
                onChange={(e) => setGain(parseInt(e.target.value))}
                min="0"
                className="bg-gray-700 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="binning">像素合并</Label>
              <Input
                id="binning"
                type="number"
                value={binning}
                onChange={(e) => setBinning(parseInt(e.target.value))}
                min="1"
                max="4"
                className="bg-gray-700 text-white"
              />
            </motion.div>
          </Grid>
          <FlexRow>
            <motion.div variants={itemVariants}>
              <Button onClick={handleStartExposure} className="sm:w-auto">
                开始曝光
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                variant="destructive"
                onClick={handleAbortExposure}
                className="sm:w-auto"
              >
                中止曝光
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
          <FlexRowCentered>
            <CardTitle>温度控制</CardTitle>
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2"
            >
              <Label htmlFor="cooler">制冷器</Label>
              <Switch
                id="cooler"
                checked={coolerOn}
                onCheckedChange={handleToggleCooler}
              />
            </motion.div>
          </FlexRowCentered>
        </CardHeader>
        <CardContent>
          <FlexRowCentered>
            <Label htmlFor="target-temp">目标温度 (°C)</Label>
            <Input
              id="target-temp"
              type="number"
              value={targetTemperature}
              onChange={(e) => setTargetTemperature(parseFloat(e.target.value))}
              className="w-full sm:w-24 bg-gray-700 text-white"
            />
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleSetTemperature}
                className="w-full sm:w-auto"
              >
                设置
              </Button>
            </motion.div>
          </FlexRowCentered>
          <motion.div variants={itemVariants} className="mt-6">
            <LineChart data={temperatureHistory} />
          </motion.div>
        </CardContent>
      </StyledCard>
    </Container>
  );
}
