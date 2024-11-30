import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PolarAlignmentProps {
  onClose: () => void;
}

export function PolarAlignment({ onClose }: PolarAlignmentProps) {
  const [azimuth, setAzimuth] = useState(0);
  const [altitude, setAltitude] = useState(0);

  const handleAlign = () => {
    // In a real application, this would send commands to the mount
    console.log(`Aligning mount: Azimuth ${azimuth}, Altitude ${altitude}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Polar Alignment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="azimuth"
              className="block text-sm font-medium text-gray-700"
            >
              Azimuth
            </label>
            <Slider
              id="azimuth"
              min={-180}
              max={180}
              step={0.1}
              value={[azimuth]}
              onValueChange={(value) => setAzimuth(value[0])}
            />
            <p className="mt-1 text-sm text-gray-500">{azimuth.toFixed(1)}°</p>
          </div>
          <div>
            <label
              htmlFor="altitude"
              className="block text-sm font-medium text-gray-700"
            >
              Altitude
            </label>
            <Slider
              id="altitude"
              min={0}
              max={90}
              step={0.1}
              value={[altitude]}
              onValueChange={(value) => setAltitude(value[0])}
            />
            <p className="mt-1 text-sm text-gray-500">{altitude.toFixed(1)}°</p>
          </div>
          <Button onClick={handleAlign}>Align Mount</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
