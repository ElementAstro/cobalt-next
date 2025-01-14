"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogStore } from "@/store/useLogStore";
import {
  X,
  Sliders,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

const animationVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

const LogFilters: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const {
    filter,
    setFilter,
    search,
    setSearch,
    logCount,
    setLogCount,
    isPaginationEnabled,
    setIsPaginationEnabled,
    isRealTimeEnabled,
    setIsRealTimeEnabled,
    isMockMode,
    setIsMockMode,
    setLogs,
    setFilteredLogs,
    logLevel,
    setLogLevel,
  } = useLogStore();

  const handleClearFilter = () => {
    setFilter("");
    setSearch("");
    setDateRange(undefined);
    setLogCount(100);
    setLogLevel("all");
    setIsPaginationEnabled(false);
    setIsRealTimeEnabled(true);
  };

  const filterCount = [
    filter ? 1 : 0,
    search ? 1 : 0,
    dateRange ? 1 : 0,
    logLevel !== "all" ? 1 : 0,
    logCount !== 100 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
    >
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            当前筛选 ({filterCount} 个条件)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          disabled={filterCount === 0}
        >
          重置所有筛选
          <X className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          type="text"
          placeholder="搜索日志内容..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="按标签过滤..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
        <Select value={logLevel} onValueChange={setLogLevel}>
          <SelectTrigger>
            <SelectValue placeholder="日志级别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="error">错误</SelectItem>
            <SelectItem value="warn">警告</SelectItem>
            <SelectItem value="info">信息</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {dateRange.from.toLocaleDateString()} -{" "}
                    {dateRange.to.toLocaleDateString()}
                  </>
                ) : (
                  dateRange.from.toLocaleDateString()
                )
              ) : (
                "选择日期范围"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          {isAdvancedOpen ? (
            <ChevronUp className="h-4 w-4 mr-2" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-2" />
          )}
          高级筛选
        </Button>

        <AnimatePresence>
          {isAdvancedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>日志数量限制</Label>
                  <Slider
                    value={[logCount]}
                    onValueChange={([value]) => setLogCount(value)}
                    max={1000}
                    step={100}
                  />
                  <div className="text-xs text-muted-foreground">
                    显示最近 {logCount} 条日志
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>分页显示</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch
                          checked={isPaginationEnabled}
                          onCheckedChange={setIsPaginationEnabled}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        启用分页显示可以提升大量日志的性能
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>实时更新</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch
                          checked={isRealTimeEnabled}
                          onCheckedChange={setIsRealTimeEnabled}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        实时更新会持续获取最新的日志
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LogFilters;
