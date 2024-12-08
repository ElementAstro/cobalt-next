import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ZoomIn, ZoomOut } from "lucide-react";
import { StarMapConfig } from "../types/star-map";

interface BasicSettingsProps {
  config: StarMapConfig;
  onChange: (updates: Partial<StarMapConfig>) => void;
  onZoom: (direction: "in" | "out") => void;
}

export function BasicSettings({
  config,
  onChange,
  onZoom,
}: BasicSettingsProps) {
  const handleCoordinateChange = (type: "ra" | "dec", value: string) => {
    onChange({
      coordinates: {
        ...config.coordinates,
        [type]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">图像来源</h2>
        <Select
          value={config.imageSource}
          onValueChange={(value) => {
            onChange({ imageSource: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择图像来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P/DSS2/color">DSS 彩色</SelectItem>
            <SelectItem value="P/allWISE/color">AllWISE 彩色</SelectItem>
            <SelectItem value="P/PanSTARRS/DR1/color-z-zg-g">
              PanSTARRS
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">坐标</h2>
        <div className="grid gap-2">
          <Label htmlFor="ra">RA</Label>
          <Input
            id="ra"
            value={config.coordinates.ra}
            onChange={(e) => handleCoordinateChange("ra", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dec">Dec</Label>
          <Input
            id="dec"
            value={config.coordinates.dec}
            onChange={(e) => handleCoordinateChange("dec", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">视场</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onZoom("in")}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={config.fieldOfView.toFixed(2)}
            onChange={(e) => {
              const newFov = parseFloat(e.target.value);
              onChange({ fieldOfView: newFov });
            }}
            step={0.1}
            min={0.1}
          />
          <Button variant="outline" size="icon" onClick={() => onZoom("out")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">投影</h2>
        <Select
          value={config.projection}
          onValueChange={(value) => onChange({ projection: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择投影" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AIT">Aitoff</SelectItem>
            <SelectItem value="MOL">Mollweide</SelectItem>
            <SelectItem value="SIN">Sinusoidal</SelectItem>
            <SelectItem value="MER">Mercator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">坐标框架</h2>
        <Select
          value={config.cooFrame}
          onValueChange={(value) => onChange({ cooFrame: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择坐标框架" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equatorial">赤道</SelectItem>
            <SelectItem value="galactic">银河</SelectItem>
            <SelectItem value="ecliptic">黄道</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
