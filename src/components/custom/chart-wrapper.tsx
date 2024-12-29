import React from "react";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Spinner } from "./spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChartWrapperProps {
  children: React.ReactNode;
  title?: string;
  controls?: React.ReactNode;
  customization?: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  headerControls?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  children,
  title,
  controls,
  customization,
  headerControls,
  isLoading,
  error,
  className = "",
  darkMode = true,
}) => {
  return (
    <Card
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } ${className}`}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                {title && <h2 className="text-xl font-semibold">{title}</h2>}
                {headerControls}
              </div>
              {controls && <div>{controls}</div>}
            </div>

            <div className="flex-1 p-4 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Spinner />
                </div>
              )}

              {error ? (
                <div className="h-full flex items-center justify-center">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </ResizablePanel>

        {customization && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={20} className="border-l">
              {customization}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </Card>
  );
};
