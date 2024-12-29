"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  toggleFullscreen,
}) => {
  return (
    <Button onClick={toggleFullscreen}>
      <Expand className="h-4 w-4 mr-2" />
      {isFullscreen ? "退出全屏" : "全屏"}
    </Button>
  );
};

export default FullscreenButton;
