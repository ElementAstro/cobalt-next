"use client";

import { FC, useState, useMemo, useCallback } from "react";
import * as AXIOSOF from "@/services/skymap/find-object";
import TargetSmallCard from "../../../components/skymap/target_small";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterIcon, Download } from "lucide-react";
import { IDSOObjectDetailedInfo } from "@/types/skymap/find-object";
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
      // 添加更多字段如果需要
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
      className="flex flex-col sm:flex-row w-full p-2 bg-gradient-to-b from-gray-900 to-gray-800 min-h-[70vh] sm:min-h-[60vh] rounded-lg overflow-hidden"
    >
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="w-full sm:w-1/4 p-2 overflow-y-auto"
      >
        <div className="sticky top-2 space-y-4">
          <Input
            placeholder="输入搜索关键词"
            value={toSearchText}
            onChange={(e) => setToSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="bg-black/50 backdrop-blur-md border-white/10"
          />
          <Button onClick={handleSearch} className="w-full">
            搜索
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleFilterToggle}
                  className="flex items-center justify-center w-full"
                >
                  <FilterIcon className="mr-2" />
                  高级搜索
                </Button>
              </TooltipTrigger>
              <TooltipContent>设置搜索过滤条件</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Collapsible open={expandFilter} onOpenChange={setExpandFilter}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {expandFilter ? "隐藏过滤条件" : "显示过滤条件"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-4">
              <Label className="block text-sm text-gray-300">
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
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </Label>
              <Label className="block text-sm text-gray-300">
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
                  className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
              </Label>
              <Label className="block text-sm text-gray-300">
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
                  <SelectTrigger className="w-full">
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
              <Label className="block text-sm text-gray-300">
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magnitude">按星等</SelectItem>
                    <SelectItem value="size">按大小</SelectItem>
                    <SelectItem value="name">按名称</SelectItem>
                  </SelectContent>
                </Select>
              </Label>
              <Label className="block text-sm text-gray-300">
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择排序顺序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">升序</SelectItem>
                    <SelectItem value="desc">降序</SelectItem>
                  </SelectContent>
                </Select>
              </Label>
            </CollapsibleContent>
          </Collapsible>
          <Button
            variant="outline"
            onClick={exportResults}
            className="w-full flex items-center justify-center"
          >
            <Download className="mr-2" />
            导出结果
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        className="w-full sm:w-3/4 p-2 overflow-y-auto"
      >
        <div className="h-full">
          {foundTargetResult.length === 0 ? (
            <Alert
              variant={alertVariant}
              className="bg-black/50 backdrop-blur-md border-white/10"
            >
              {alertText}
            </Alert>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.magData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="magnitude" />
                  <YAxis />
                  <ReTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {paginatedResults.map((target, index) => (
                  <motion.div
                    key={target.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>
                  <span className="text-gray-300">
                    第 {currentPage} 页，共 {totalPages} 页
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

ObjectSearch.defaultProps = {
  on_choice_maken: null,
};

export default ObjectSearch;
