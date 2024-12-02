"use client";

import { useState } from "react";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LineChart } from "../components/line-chart";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "../components/device-selector";

const Container = styled.div`
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const StyledCard = styled(Card)`
  background-color: rgba(47, 79, 79, 0.5);
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const FlexRowCentered = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

export function Camera() {
  const [exposure, setExposure] = useState("1");
  const [gain, setGain] = useState("0");
  const [binning, setBinning] = useState("1");
  const { toast } = useToast();
  const {
    cameraInfo,
    startExposure,
    abortExposure,
    setTemperature,
    toggleCooler,
  } = useMockBackend();

  const handleStartExposure = () => {
    startExposure(parseFloat(exposure), parseInt(gain), parseInt(binning));
    toast({
      title: "Starting Exposure",
      description: `Exposure: ${exposure}s, Gain: ${gain}, Binning: ${binning}x${binning}`,
    });
  };

  const handleAbortExposure = () => {
    abortExposure();
    toast({
      title: "Aborting Exposure",
      description: "The current exposure has been aborted.",
    });
  };

  const handleSetTemperature = () => {
    setTemperature(cameraInfo.targetTemperature);
    toast({
      title: "Setting Temperature",
      description: `Target temperature set to ${cameraInfo.targetTemperature}°C`,
    });
  };

  const handleToggleCooler = () => {
    toggleCooler();
    toast({
      title: "Toggling Cooler",
      description: `Cooler ${cameraInfo.coolerOn ? "enabled" : "disabled"}`,
    });
  };

  return (
    <Container>
      <DeviceSelector
        deviceType="Camera"
        devices={["ZWO ASI294MC Pro", "QHY600M", "Atik 16200"]}
        onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
      />
      <StyledCard>
        <CardHeader>
          <CardTitle>Camera Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <div className="space-y-2">
              <Label>Sensor type</Label>
              <div className="text-sm">{cameraInfo.sensorType}</div>
            </div>
            <div className="space-y-2">
              <Label>Sensor size</Label>
              <div className="text-sm">{cameraInfo.sensorSize}</div>
            </div>
            <div className="space-y-2">
              <Label>Pixel size</Label>
              <div className="text-sm">{cameraInfo.pixelSize}</div>
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <div className="text-sm">{cameraInfo.temperature}°C</div>
            </div>
          </Grid>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardHeader>
          <CardTitle>Exposure Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <div className="space-y-2">
              <Label htmlFor="exposure">Exposure (s)</Label>
              <Input
                id="exposure"
                type="number"
                value={exposure}
                onChange={(e) => setExposure(e.target.value)}
                min="0.001"
                step="0.001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gain">Gain</Label>
              <Input
                id="gain"
                type="number"
                value={gain}
                onChange={(e) => setGain(e.target.value)}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="binning">Binning</Label>
              <Input
                id="binning"
                type="number"
                value={binning}
                onChange={(e) => setBinning(e.target.value)}
                min="1"
                max="4"
              />
            </div>
          </Grid>
          <FlexRow>
            <Button onClick={handleStartExposure} className=" sm:w-auto">
              Start Exposure
            </Button>
            <Button
              variant="destructive"
              onClick={handleAbortExposure}
              className=" sm:w-auto"
            >
              Abort Exposure
            </Button>
          </FlexRow>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardHeader>
          <FlexRowCentered>
            <CardTitle>Temperature Control</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="cooler">Cooler</Label>
              <Switch
                id="cooler"
                checked={cameraInfo.coolerOn}
                onCheckedChange={handleToggleCooler}
              />
            </div>
          </FlexRowCentered>
        </CardHeader>
        <CardContent>
          <FlexRowCentered>
            <Label htmlFor="target-temp">Target Temperature (°C)</Label>
            <Input
              id="target-temp"
              type="number"
              value={cameraInfo.targetTemperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full sm:w-24"
            />
            <Button onClick={handleSetTemperature} className="w-full sm:w-auto">
              Set
            </Button>
          </FlexRowCentered>
          <div className="mt-4">
            <LineChart data={cameraInfo.temperatureHistory} />
          </div>
        </CardContent>
      </StyledCard>
    </Container>
  );
}
