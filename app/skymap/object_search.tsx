"use client";

import { FC, useState } from "react";
import * as AXIOSOF from "@/services/skymap/find-object";
import TargetSmallCard from "../../components/skymap/target_small";
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
import { FilterIcon } from "lucide-react";
import { IDSOObjectDetailedInfo } from "@/types/skymap/find-object";

interface ObjectSearchProps {
  on_choice_maken: (() => void) | null;
}

const ObjectSearch: FC<ObjectSearchProps> = (props) => {
  // UI 控制
  const [expandFilter, setExpandFilter] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [alertText, setAlertText] =
    useState("请在左侧输入框输入需要搜索的信息");

  // 数据
  const [toSearchText, setToSearchText] = useState("-");
  const [foundTargetResult, setFoundTargetResult] = useState<
    Array<IDSOObjectDetailedInfo>
  >([]);
  const [filterSettings, updateFilterSettings] = useState({
    angular_size: 1, // in arc degree
  });

  const handleFilterToggle = () => {
    setExpandFilter(!expandFilter);
  };

  const handleSearch = async () => {
    if (toSearchText === "-") {
      return;
    }
    setFoundTargetResult([]);
    setAlertVariant("default");
    setAlertText("查询中...");
    try {
      const found_targets = await AXIOSOF.findTargetByName(toSearchText);
      console.log(found_targets);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col md:flex-row w-full p-4 bg-gradient-to-b from-gray-900 to-gray-800 min-h-[80vh] rounded-lg"
    >
      <motion.div 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="w-full md:w-1/4 p-4"
      >
        <div className="sticky top-4 space-y-4">
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
              <Button variant="outline" className="w-full mt-2">
                {expandFilter ? "隐藏过滤条件" : "显示过滤条件"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
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
              {/* 其他过滤条件可以在此添加 */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </motion.div>

      <motion.div 
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        className="w-full md:w-3/4 p-4"
      >
        <div className="h-full overflow-auto">
          {foundTargetResult.length === 0 ? (
            <Alert 
              variant={alertVariant}
              className="bg-black/50 backdrop-blur-md border-white/10"
            >
              {alertText}
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundTargetResult.map((target, index) => (
                <motion.div
                  key={target.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
