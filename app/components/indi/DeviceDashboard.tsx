import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INDIDevice } from "@/types/indi";
import {
  Loader2,
  Power,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface DeviceDashboardProps {
  devices: INDIDevice[];
}

export const DeviceDashboard: React.FC<DeviceDashboardProps> = ({
  devices,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Device Dashboard</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isOpen ? "Close" : "Open"} device dashboard
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.name}>
              <CardHeader>
                <CardTitle>{device.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {device.state === "Connected" && (
                    <Power className="text-green-500" />
                  )}
                  {device.state === "Disconnected" && (
                    <Power className="text-gray-500" />
                  )}
                  {device.state === "Connecting" && (
                    <Loader2 className="animate-spin text-blue-500" />
                  )}
                  {device.state === "Error" && (
                    <AlertTriangle className="text-red-500" />
                  )}
                </div>
                <div>
                  <span>
                    Properties:{" "}
                    {device.groups.reduce(
                      (acc, group) => acc + group.properties.length,
                      0
                    )}
                  </span>
                </div>
                <div>
                  <span>Groups: {device.groups.length}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
