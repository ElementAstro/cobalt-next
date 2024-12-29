"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Locate, X } from "lucide-react";

interface WeatherInfoHeaderProps {
  onClose: () => void;
}

const WeatherInfoHeader: React.FC<WeatherInfoHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Locate className="w-6 h-6 text-white" />
        <span className="text-white text-xl">城市天气信息</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default WeatherInfoHeader;
