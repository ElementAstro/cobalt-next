import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TodoFilterProps {
  filter: {
    category: string;
    priority: string;
    completed: string;
    dueDateStart: string;
    dueDateEnd: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      category: string;
      priority: string;
      completed: string;
      dueDateStart: string;
      dueDateEnd: string;
    }>
  >;
}

export function TodoFilter({ filter, setFilter }: TodoFilterProps) {
  const [showDateRange, setShowDateRange] = useState(false);

  const handleReset = () => {
    setFilter({
      category: "all",
      priority: "all",
      completed: "all",
      dueDateStart: "",
      dueDateEnd: "",
    });
    setShowDateRange(false);
  };

  return (
    <motion.div
      className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category Filter */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="mb-1 text-sm font-medium dark:text-gray-300">
            类别
          </Label>
          <Select
            value={filter.category}
            onValueChange={(value) => setFilter({ ...filter, category: value })}
          >
            <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
              <SelectValue placeholder="所有类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类别</SelectItem>
              <SelectItem value="personal">个人</SelectItem>
              <SelectItem value="work">工作</SelectItem>
              <SelectItem value="study">学习</SelectItem>
              <SelectItem value="astronomy">天文学</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Priority Filter */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="mb-1 text-sm font-medium dark:text-gray-300">
            优先级
          </Label>
          <Select
            value={filter.priority}
            onValueChange={(value) => setFilter({ ...filter, priority: value })}
          >
            <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
              <SelectValue placeholder="所有优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有优先级</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Completed Filter */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="mb-1 text-sm font-medium dark:text-gray-300">
            状态
          </Label>
          <Select
            value={filter.completed}
            onValueChange={(value) =>
              setFilter({ ...filter, completed: value })
            }
          >
            <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
              <SelectValue placeholder="所有状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有</SelectItem>
              <SelectItem value="active">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Due Date Range Filter */}
      <motion.div
        className="mt-4 flex flex-col"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showDateRange ? 1 : 0,
          height: showDateRange ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {showDateRange && (
          <>
            <Label className="mb-1 text-sm font-medium dark:text-gray-300">
              截止日期范围
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                value={filter.dueDateStart}
                onChange={(e) =>
                  setFilter({ ...filter, dueDateStart: e.target.value })
                }
                className="w-full dark:bg-gray-700 dark:text-gray-200"
              />
              <Input
                type="date"
                value={filter.dueDateEnd}
                onChange={(e) =>
                  setFilter({ ...filter, dueDateEnd: e.target.value })
                }
                className="w-full dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0">
        <Button
          variant="outline"
          onClick={() => setShowDateRange(!showDateRange)}
          className="w-full sm:w-auto dark:text-gray-200"
        >
          {showDateRange ? "隐藏日期筛选" : "显示日期筛选"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleReset}
          className="w-full sm:w-auto dark:bg-red-600 dark:text-white"
        >
          重置筛选
        </Button>
      </div>
    </motion.div>
  );
}
