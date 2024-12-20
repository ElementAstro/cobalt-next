import React from "react";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CustomizationPanel } from "./CustomizationPanel";

interface ChartWrapperProps {
  children: React.ReactNode;
  title?: string;
  controls?: React.ReactNode;
  customization?: React.ReactNode;
  className?: string;
  darkMode?: boolean;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  children,
  title,
  controls,
  customization,
  className = "",
  darkMode = true,
}) => {
  return (
    <Card
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } ${className}`}
    >
      <ResizablePanelGroup direction="horizontal" className="min-h-[400px]">
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full p-4">
            {title && (
              <h2 className="text-xl font-semibold mb-4">{title}</h2>
            )}
            <div className="relative h-full">
              {children}
              {controls && (
                <div className="absolute bottom-4 right-4">{controls}</div>
              )}
            </div>
          </div>
        </ResizablePanel>
        {customization && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className="h-full p-4">{customization}</div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </Card>
  );
};
