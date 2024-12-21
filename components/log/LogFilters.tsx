// LogFilters.tsx
import React, { useState } from "react";
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
import { useLogStore } from "@/lib/store/log";
import { X, Sliders, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const LogFilters: React.FC = () => {
  const [date, setDate] = useState<Date>();
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
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="搜索日志内容..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="按标签过滤..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleClearFilter}
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Sliders className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm">时间范围</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date ? date.toLocaleDateString() : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>日志数量限制</Label>
                <Slider
                  value={[logCount]}
                  onValueChange={([value]) => setLogCount(value)}
                  max={1000}
                  step={100}
                />
                <div className="text-xs text-gray-500">
                  显示最近 {logCount} 条日志
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isPaginationEnabled}
            onCheckedChange={setIsPaginationEnabled}
          />
          <span>分页显示</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isRealTimeEnabled}
            onCheckedChange={setIsRealTimeEnabled}
          />
          <span>实时更新</span>
        </div>
        <Select value={logLevel} onValueChange={setLogLevel}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="日志级别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="error">错误</SelectItem>
            <SelectItem value="warn">警告</SelectItem>
            <SelectItem value="info">信息</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LogFilters;
