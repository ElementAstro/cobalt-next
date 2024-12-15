"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChartComponent } from "../../../components/autofocus/ChartComponent";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartLegend } from "../../../components/autofocus/ChartLegend";
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

export default function FocusAssistant() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<"real" | "mock">("real");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-screen max-h-screen overflow-hidden bg-gray-900 text-white"
    >
      <ScrollArea className="h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto p-4 space-y-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4"
              >
                <motion.h1
                  variants={itemVariants}
                  className="text-2xl font-bold"
                >
                  Focuser Control
                </motion.h1>
                <motion.div variants={itemVariants} className="flex-shrink-0">
                  <ToggleGroup
                    type="single"
                    value={mode}
                    onValueChange={(value) => setMode(value as "real" | "mock")}
                    className="flex-shrink-0"
                  >
                    <ToggleGroupItem
                      value="real"
                      aria-label="Real mode"
                      className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Real
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="mock"
                      aria-label="Mock mode"
                      className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                      Mock
                    </ToggleGroupItem>
                  </ToggleGroup>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              >
                <motion.div variants={itemVariants}>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <div className="flex gap-2">
                      <Input
                        id="position"
                        placeholder="Enter position"
                        className="bg-gray-700 text-white"
                      />
                      <Button
                        variant="secondary"
                        className="bg-gray-700 hover:bg-gray-600 whitespace-nowrap"
                      >
                        GO TO
                      </Button>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div>
                    <Label htmlFor="filter">Filter</Label>
                    <Select>
                      <SelectTrigger
                        id="filter"
                        className="bg-gray-700 text-white"
                      >
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white">
                        <SelectItem value="clear">Clear</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between sm:col-span-2 lg:col-span-1"
                >
                  <span>Autofocus Enabled</span>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                    className="bg-gray-700"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6"
              >
                <motion.div variants={itemVariants}>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    GO TO FOCUS STAR
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    INJECT-FOCUS
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    ROBOSTAR
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    LOCALFIELD
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    FOCUS ON PLACE
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <ChartLegend />
                  <ChartComponent mode={mode} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Label htmlFor="focus-adjustment">Focus Adjustment</Label>
                  <Slider
                    id="focus-adjustment"
                    max={100}
                    step={1}
                    defaultValue={[50]}
                    className="mt-2 bg-gray-700"
                  />

                  <Tabs defaultValue="time" className="w-full mt-6">
                    <TabsList className="w-full bg-gray-800 border-t border-gray-700 grid grid-cols-3 sm:grid-cols-6">
                      <TabsTrigger
                        value="time"
                        className="text-white hover:bg-gray-600"
                      >
                        TIME
                      </TabsTrigger>
                      <TabsTrigger
                        value="hfd"
                        className="text-white hover:bg-gray-600"
                      >
                        HFD
                      </TabsTrigger>
                      <TabsTrigger
                        value="fltr"
                        className="text-white hover:bg-gray-600"
                      >
                        FLTR
                      </TabsTrigger>
                      <TabsTrigger
                        value="temp"
                        className="text-white hover:bg-gray-600"
                      >
                        TEMP
                      </TabsTrigger>
                      <TabsTrigger
                        value="percdev"
                        className="text-white hover:bg-gray-600"
                      >
                        PERCDEV
                      </TabsTrigger>
                      <TabsTrigger
                        value="durat"
                        className="text-white hover:bg-gray-600"
                      >
                        DURAT
                      </TabsTrigger>
                    </TabsList>
                    <motion.div variants={itemVariants}>
                      <TabsContent
                        value="time"
                        className="h-32 overflow-y-auto"
                      >
                        Time data visualization
                      </TabsContent>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TabsContent value="hfd" className="h-32 overflow-y-auto">
                        HFD data visualization
                      </TabsContent>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TabsContent
                        value="fltr"
                        className="h-32 overflow-y-auto"
                      >
                        Filter data visualization
                      </TabsContent>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TabsContent
                        value="temp"
                        className="h-32 overflow-y-auto"
                      >
                        Temperature data visualization
                      </TabsContent>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TabsContent
                        value="percdev"
                        className="h-32 overflow-y-auto"
                      >
                        Percentage deviation data visualization
                      </TabsContent>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <TabsContent
                        value="durat"
                        className="h-32 overflow-y-auto"
                      >
                        Duration data visualization
                      </TabsContent>
                    </motion.div>
                  </Tabs>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </ScrollArea>
    </motion.div>
  );
}
