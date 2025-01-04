"use client";

import { FC, useState, useMemo } from "react";
import * as AXIOSOF from "@/services/find-object";
import TargetSmallCard from "./target-small";
import { motion } from "framer-motion";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FilterIcon, Download, Search, ChevronDown } from "lucide-react";
import { IDSOObjectDetailedInfo } from "@/types/skymap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ObjectSearchProps {
  on_choice_maken: (() => void) | null;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ObjectSearch: FC<ObjectSearchProps> = (props) => {
  // UI 控制
  const [expandFilter, setExpandFilter] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [alertText, setAlertText] =
    useState("请在左侧输入框输入需要搜索的信息");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 数据
  const [toSearchText, setToSearchText] = useState("");
  const [foundTargetResult, setFoundTargetResult] = useState<
    Array<IDSOObjectDetailedInfo>
  >([]);
  const [filterSettings, updateFilterSettings] = useState({
    angular_size: 1, // in arc degree
    magnitude_limit: 20,
    type: "all",
    sort_by: "magnitude",
    sort_order: "asc",
  });

  const handleFilterToggle = () => {
    setExpandFilter(!expandFilter);
  };

  const handleSearch = async () => {
    if (toSearchText.trim() === "") {
      setAlertVariant("destructive");
      setAlertText("搜索关键词不能为空！");
      return;
    }
    setFoundTargetResult([]);
    setAlertVariant("default");
    setAlertText("查询中...");
    try {
      const found_targets = await AXIOSOF.findTargetByName(toSearchText);
      if (found_targets.success) {
        if (found_targets.data.length > 0) {
          setFoundTargetResult(found_targets.data);
          setAlertVariant("default");
          setAlertText(`找到 ${found_targets.data.length} 个目标`);
        } else {
          setAlertVariant("default");
          setAlertText("没有找到相关目标");
        }
      } else {
        setAlertVariant("destructive");
        setAlertText("查询失败，请稍后重试！");
      }
    } catch (err) {
      setAlertVariant("destructive");
      setAlertText("发生错误，请检查网络连接！");
    }
  };

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return foundTargetResult.slice(start, start + itemsPerPage);
  }, [foundTargetResult, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(foundTargetResult.length / itemsPerPage);
  }, [foundTargetResult.length]);

  const chartData = useMemo(() => {
    const typeCount: { [key: string]: number } = {};
    const magnitudeData: Array<{ magnitude: number; count: number }> = [];

    foundTargetResult.forEach((target) => {
      typeCount[target.type] = (typeCount[target.type] || 0) + 1;
      const mag = Math.floor(target.magnitude);
      if (!magnitudeData[mag]) {
        magnitudeData[mag] = { magnitude: mag, count: 1 };
      } else {
        magnitudeData[mag].count += 1;
      }
    });

    const typeData = Object.keys(typeCount).map((key) => ({
      name: key,
      value: typeCount[key],
    }));

    const magData = magnitudeData.filter(Boolean);

    return { typeData, magData };
  }, [foundTargetResult]);

  const exportResults = () => {
    if (foundTargetResult.length === 0) {
      toast({
        title: "无数据可导出",
        description: "请先进行搜索并获取结果。",
      });
      return;
    }
    const data = foundTargetResult.map((target) => ({
      Name: target.name,
      Type: target.type,
      Magnitude: target.magnitude,
      AngularSize: target.angular_size,
    }));
    const csvContent = `data:text/csv;charset=utf-8,${[
      "Name",
      "Type",
      "Magnitude",
      "AngularSize",
    ].join(",")}\n${data
      .map((t) => `${t.Name},${t.Type},${t.Magnitude},${t.AngularSize}`)
      .join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "search_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row w-full gap-2 p-4 bg-gradient-to-b from-gray-900 to-gray-800 min-h-[70vh] rounded-lg relative"
    >
      {/* Loading overlay */}
      {alertText === "查询中..." && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">正在搜索...</span>
          </div>
        </motion.div>
      )}
      {/* 搜索工具栏 */}
      <div className="w-full lg:w-1/4 space-y-2">
        <Card className="bg-black/20 p-2">
          <CardHeader>
            <CardTitle className="text-sm">搜索工具</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="relative">
              <Input
                placeholder="输入搜索关键词"
                value={toSearchText}
                onChange={(e) => setToSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="pr-8 text-xs"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSearch}
                className="w-full text-xs relative overflow-hidden"
              >
                <span className="relative z-10">搜索</span>
                <motion.span
                  initial={{ x: "-100%" }}
                  animate={{ x: toSearchText ? "0%" : "-100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-green-500/10 z-0"
                />
              </Button>
            </motion.div>

            <Collapsible>
              <CollapsibleTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex justify-between text-xs"
                  >
                    高级筛选
                    <motion.span
                      animate={{ rotate: expandFilter ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label className="block text-xs text-gray-300">
                    角大小 (度):
                    <Input
                      type="number"
                      value={filterSettings.angular_size}
                      onChange={(e) =>
                        updateFilterSettings((prevState) => ({
                          ...prevState,
                          angular_size: Number(e.target.value),
                        }))
                      }
                      className="mt-1 block w-full p-1 bg-gray-800 border border-gray-700 rounded-md text-white text-xs"
                    />
                  </Label>
                  <Label className="block text-xs text-gray-300">
                    星等限制:
                    <Input
                      type="number"
                      value={filterSettings.magnitude_limit}
                      onChange={(e) =>
                        updateFilterSettings((prev) => ({
                          ...prev,
                          magnitude_limit: Number(e.target.value),
                        }))
                      }
                      className="mt-1 block w-full p-1 bg-gray-800 border border-gray-700 rounded-md text-white text-xs"
                    />
                  </Label>
                  <Label className="block text-xs text-gray-300">
                    天体类型:
                    <Select
                      value={filterSettings.type}
                      onValueChange={(value) =>
                        updateFilterSettings((prev) => ({
                          ...prev,
                          type: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="galaxy">星系</SelectItem>
                        <SelectItem value="nebula">星云</SelectItem>
                        <SelectItem value="cluster">星团</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                  <Label className="block text-xs text-gray-300">
                    排序方式:
                    <Select
                      value={filterSettings.sort_by}
                      onValueChange={(value) =>
                        updateFilterSettings((prev) => ({
                          ...prev,
                          sort_by: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="选择排序方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magnitude">按星等</SelectItem>
                        <SelectItem value="size">按大小</SelectItem>
                        <SelectItem value="name">按名称</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                  <Label className="block text-xs text-gray-300">
                    排序顺序:
                    <Select
                      value={filterSettings.sort_order}
                      onValueChange={(value) =>
                        updateFilterSettings((prev) => ({
                          ...prev,
                          sort_order: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="选择排序顺序" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">升序</SelectItem>
                        <SelectItem value="desc">降序</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>

            <Button
              variant="outline"
              onClick={exportResults}
              className="w-full flex items-center justify-center gap-1 text-xs"
            >
              <Download className="w-3 h-3" />
              导出
            </Button>
          </CardContent>
        </Card>

        {/* 统计图表 */}
        <Card className="bg-black/20 p-2">
          <CardHeader>
            <CardTitle className="text-sm">搜索统计</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={chartData.typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {chartData.typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chartData.magData}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="magnitude" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ReTooltip />
                <Legend fontSize={10} />
                <Bar dataKey="count" fill="#82ca9d" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 搜索结果 */}
      <div className="w-full lg:w-3/4">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          {foundTargetResult.length === 0 ? (
            <Alert variant={alertVariant} className="text-xs">
              {alertText}
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {paginatedResults.map((target, index) => (
                  <motion.div
                    key={target.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <TargetSmallCard
                      target_info={target}
                      card_index={index}
                      on_card_clicked={null}
                      on_choice_maken={props.on_choice_maken}
                    />
                  </motion.div>
                ))}
              </div>

              {/* 分页控制 */}
              {totalPages > 1 && (
                <Pagination className="py-2">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-gray-400 text-xs">
                        第 {currentPage} 页，共 {totalPages} 页
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default ObjectSearch;
