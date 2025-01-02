import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSearchStore from "@/store/useSearchStore";

const CONSTELLATIONS = [
  "UMA",
  "CYG",
  "PYX",
  "ORI",
  "CAS",
  "LEO",
  "AQR",
  "SCO",
  "TAU",
  "VIR",
];
const OBJECT_TYPES = [
  "OPNCL",
  "DRKNB",
  "BRTNB",
  "GALXY",
  "PLNTN",
  "STAR",
  "ASTER",
  "COMET",
  "NOVA",
];

export function FilterPanel() {
  const { filters, setFilters } = useSearchStore();
  const [search, setSearch] = useState("");

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCheckboxChange = (
    key: "constellations" | "types",
    value: string
  ) => {
    const currentValues = filters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  const handleSliderChange = (
    key: "minMagnitude" | "maxMagnitude" | "minDistance" | "maxDistance",
    value: number[]
  ) => {
    handleFilterChange(key, value[0]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredConstellations = CONSTELLATIONS.filter((constellation) =>
    constellation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            placeholder="搜索星座..."
            value={search}
            onChange={handleSearchChange}
            className="mb-4 dark:bg-gray-700 dark:text-white"
          />
        </motion.div>
      </AnimatePresence>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="constellations">
          <AccordionTrigger>星座</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px]">
              <div className="grid grid-cols-2 gap-2">
                {filteredConstellations.map((constellation) => (
                  <div
                    key={constellation}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`constellation-${constellation}`}
                      checked={filters.constellations.includes(constellation)}
                      onCheckedChange={() =>
                        handleCheckboxChange("constellations", constellation)
                      }
                    />
                    <Label htmlFor={`constellation-${constellation}`}>
                      {constellation}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>对象类型</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {OBJECT_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={() => handleCheckboxChange("types", type)}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="magnitude">
          <AccordionTrigger>星等</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>最小星等: {filters.minMagnitude}</Label>
                <Slider
                  min={-30}
                  max={30}
                  step={0.1}
                  value={[filters.minMagnitude]}
                  onValueChange={(value) =>
                    handleSliderChange("minMagnitude", value)
                  }
                />
              </div>
              <div>
                <Label>最大星等: {filters.maxMagnitude}</Label>
                <Slider
                  min={-30}
                  max={30}
                  step={0.1}
                  value={[filters.maxMagnitude]}
                  onValueChange={(value) =>
                    handleSliderChange("maxMagnitude", value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="distance">
          <AccordionTrigger>距离 (光年)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>最小距离: {filters.minDistance} ly</Label>
                <Slider
                  min={0}
                  max={1000000}
                  step={100}
                  value={[filters.minDistance]}
                  onValueChange={(value) =>
                    handleSliderChange("minDistance", value)
                  }
                />
              </div>
              <div>
                <Label>最大距离: {filters.maxDistance} ly</Label>
                <Slider
                  min={0}
                  max={1000000}
                  step={100}
                  value={[filters.maxDistance]}
                  onValueChange={(value) =>
                    handleSliderChange("maxDistance", value)
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced">
          <AccordionTrigger>高级选项</AccordionTrigger>
          <AccordionContent>
            <TooltipProvider>
              <div className="space-y-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Label>最佳观测时间</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunset">日落时分</SelectItem>
                          <SelectItem value="midnight">午夜</SelectItem>
                          <SelectItem value="sunrise">日出时分</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>选择最适合观测的时间段</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Label>大气条件</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择条件" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">极好</SelectItem>
                          <SelectItem value="good">良好</SelectItem>
                          <SelectItem value="fair">一般</SelectItem>
                          <SelectItem value="poor">较差</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>根据大气条件筛选最佳观测目标</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() =>
            setFilters({
              constellations: [],
              types: [],
              minMagnitude: -30,
              maxMagnitude: 30,
              minDistance: 0,
              maxDistance: 1000000,
            })
          }
          className="w-full"
        >
          重置筛选
        </Button>
      </motion.div>
    </motion.div>
  );
}
