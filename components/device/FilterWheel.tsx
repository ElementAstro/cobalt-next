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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
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

const InfoGrid = styled(motion.div)`
  display: grid;
  gap: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

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
      <div className="max-w-7xl mx-auto space-y-8">
        <DeviceSelector
          deviceType="Filter Wheel"
          devices={["ZWO EFW", "Starlight Xpress 5-position", "Atik EFW2"]}
          onDeviceChange={(device) =>
            console.log(`Selected filter wheel: ${device}`)
          }
        />

        <StyledCard>
          <CardHeader>
            <CardTitle>滤镜轮信息</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoGrid
              variants={containerVariants}
              initial="hidden"
              animate="visible"
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
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>当前滤镜</Label>
                <div className="text-sm">{filterWheelInfo.currentFilter}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>描述</Label>
                <div className="text-sm">{filterWheelInfo.description}</div>
              </motion.div>
            </InfoGrid>

            <motion.div variants={itemVariants} className="mt-8 space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 items-start">
                <div className="w-full sm:w-64">
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
                </div>
                <Button
                  onClick={handleFilterChange}
                  className="w-full sm:w-auto mt-4 sm:mt-6"
                >
                  更换滤镜
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </StyledCard>
      </div>
    </Container>
  );
}
