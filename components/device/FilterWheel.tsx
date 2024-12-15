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
import { useFilterWheelStore } from "@/lib/store/device/filterwheel";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import styled from "styled-components";

const Container = styled(motion.div)`
  color: white;
  background-color: #1f2937;
  min-height: 100vh;
  padding: 1rem;
`;

const StyledCard = styled(Card)`
  background-color: #374151;
  border-color: #4b5563;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

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

export function FilterWheelPage() {
  const { toast } = useToast();
  const { filterWheelInfo, selectedFilter, setSelectedFilter, changeFilter } =
    useFilterWheelStore();

  const handleFilterChange = () => {
    changeFilter(parseInt(selectedFilter));
    toast({
      title: "更换滤镜",
      description: `已切换至滤镜 ${selectedFilter}`,
    });
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <DeviceSelector
        deviceType="Filter Wheel"
        devices={["ZWO EFW", "Starlight Xpress 5-position", "Atik EFW2"]}
        onDeviceChange={(device) =>
          console.log(`Selected filter wheel: ${device}`)
        }
      />
      <motion.div
        variants={itemVariants}
        className="mt-6 grid gap-4 lg:grid-cols-2"
      >
        <StyledCard>
          <CardHeader>
            <CardTitle>滤镜轮信息</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>名称</Label>
                <div className="text-sm">{filterWheelInfo.name}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>驱动信息</Label>
                <div className="text-sm">{filterWheelInfo.driverInfo}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>驱动版本</Label>
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
                <Label>当前滤镜</Label>
                <div className="text-sm">{filterWheelInfo.currentFilter}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="filter-select">选择滤镜</Label>
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <SelectTrigger
                    id="filter-select"
                    className="w-full sm:w-[200px]"
                  >
                    <SelectValue placeholder="请选择滤镜" />
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
                  更换滤镜
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label>描述</Label>
              <div className="text-sm">{filterWheelInfo.description}</div>
            </motion.div>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Container>
  );
}
