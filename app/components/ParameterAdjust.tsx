import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParameterAdjustProps {
  parameter: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function ParameterAdjust({
  parameter,
  value,
  onChange,
  onClose,
}: ParameterAdjustProps) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setCurrentValue(newValue);
  };

  const handleSave = () => {
    onChange(currentValue);
    onClose();
  };

  const renderControl = () => {
    switch (parameter) {
      case "shutterSpeed":
        return (
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select shutter speed" />
            </SelectTrigger>
            <SelectContent>
              {[
                "1/1000",
                "1/500",
                "1/250",
                "1/125",
                "1/60",
                "1/30",
                "1/15",
                "1/8",
                "1/4",
                "1/2",
                "1",
                "2",
                "4",
                "8",
                "15",
                "30",
              ].map((speed) => (
                <SelectItem key={speed} value={speed}>
                  {speed}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "iso":
        return (
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select ISO" />
            </SelectTrigger>
            <SelectContent>
              {[
                "100",
                "200",
                "400",
                "800",
                "1600",
                "3200",
                "6400",
                "12800",
              ].map((iso) => (
                <SelectItem key={iso} value={iso}>
                  {iso}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "aperture":
        return (
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select aperture" />
            </SelectTrigger>
            <SelectContent>
              {[
                "f/1.4",
                "f/2",
                "f/2.8",
                "f/4",
                "f/5.6",
                "f/8",
                "f/11",
                "f/16",
                "f/22",
              ].map((aperture) => (
                <SelectItem key={aperture} value={aperture}>
                  {aperture}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "focusPoint":
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      case "filterType":
        return (
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              {["Clear", "Red", "Green", "Blue", "Luminance"].map((filter) => (
                <SelectItem key={filter} value={filter}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-sm mx-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <Label htmlFor={parameter} className="text-lg font-semibold mb-2 block">
          {parameter.replace(/([A-Z])/g, " $1").trim()}
        </Label>
        {renderControl()}
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
