"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMockBackend } from "@/utils/mock-device";
import { DeviceSelector } from "./device-selector";

export function FilterWheel() {
  const [selectedFilter, setSelectedFilter] = useState("1");
  const { toast } = useToast();
  const { filterWheelInfo, changeFilter } = useMockBackend();

  const handleFilterChange = () => {
    changeFilter(parseInt(selectedFilter));
    toast({
      title: "Changing Filter",
      description: `Changing to filter ${selectedFilter}`,
    });
  };

  return (
    <div className="space-y-4">
      <DeviceSelector
        deviceType="Filter Wheel"
        devices={["ZWO EFW", "Starlight Xpress 5-position", "Atik EFW2"]}
        onDeviceChange={(device) =>
          console.log(`Selected filter wheel: ${device}`)
        }
      />
      <div className="grid gap-4">
        <Card className="bg-slate-800/50">
          <CardHeader>
            <CardTitle>Filter Wheel Control</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="text-sm">{filterWheelInfo.name}</div>
              </div>
              <div className="space-y-2">
                <Label>Driver info</Label>
                <div className="text-sm">{filterWheelInfo.driverInfo}</div>
              </div>
              <div className="space-y-2">
                <Label>Driver version</Label>
                <div className="text-sm">{filterWheelInfo.driverVersion}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Filter</Label>
                <div className="text-sm">{filterWheelInfo.currentFilter}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-select">Select Filter</Label>
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <SelectTrigger id="filter-select" className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterWheelInfo.filters.map((filter, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {filter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFilterChange}>Change Filter</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="text-sm text-muted-foreground">
                {filterWheelInfo.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
