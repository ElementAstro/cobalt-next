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
import { DeviceSelector } from "../components/device-selector";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 p-4 text-white"
    >
      <DeviceSelector
        deviceType="Filter Wheel"
        devices={["ZWO EFW", "Starlight Xpress 5-position", "Atik EFW2"]}
        onDeviceChange={(device) =>
          console.log(`Selected filter wheel: ${device}`)
        }
      />
      <motion.div variants={itemVariants} className="grid gap-4">
        <Card className="bg-slate-800/50">
          <CardHeader>
            <CardTitle>Filter Wheel Control</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Name</Label>
                <div className="text-sm">{filterWheelInfo.name}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Driver info</Label>
                <div className="text-sm">{filterWheelInfo.driverInfo}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Driver version</Label>
                <div className="text-sm">{filterWheelInfo.driverVersion}</div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Current Filter</Label>
                <div className="text-sm">{filterWheelInfo.currentFilter}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="filter-select">Select Filter</Label>
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <SelectTrigger
                    id="filter-select"
                    className="w-full sm:w-[200px]"
                  >
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
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-2"
              >
                <Button
                  onClick={handleFilterChange}
                  className="w-full sm:w-auto"
                >
                  Change Filter
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Description</Label>
              <div className="text-sm">{filterWheelInfo.description}</div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
