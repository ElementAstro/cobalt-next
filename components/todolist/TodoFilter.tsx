import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
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
    celestialObject: string; // 新增过滤条件
    createdDateStart: string;
    createdDateEnd: string;
    modifiedDateStart: string;
    modifiedDateEnd: string;
    searchText: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      category: string;
      priority: string;
      completed: string;
      dueDateStart: string;
      dueDateEnd: string;
      celestialObject: string; // 新增过滤条件
      createdDateStart: string;
      createdDateEnd: string;
      modifiedDateStart: string;
      modifiedDateEnd: string;
      searchText: string;
    }>
  >;
}

export function TodoFilter({ filter, setFilter }: TodoFilterProps) {
  const [showDateRange, setShowDateRange] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleReset = () => {
    setFilter({
      category: "all",
      priority: "all",
      completed: "all",
      dueDateStart: "",
      dueDateEnd: "",
      celestialObject: "", // 新增过滤条件
      createdDateStart: "",
      createdDateEnd: "",
      modifiedDateStart: "",
      modifiedDateEnd: "",
      searchText: "",
    });
    setShowDateRange(false);
    setShowAdvancedFilters(false);
  };

  return (
    <motion.div
      className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 搜索栏 */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="搜索待办事项..."
          value={filter.searchText}
          onChange={(e) => setFilter({ ...filter, searchText: e.target.value })}
          className="w-full"
        />
      </div>

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

      {/* Celestial Object Filter */}
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label className="mb-1 text-sm font-medium dark:text-gray-300">
          天体名称
        </Label>
        <Input
          type="text"
          value={filter.celestialObject}
          onChange={(e) =>
            setFilter({ ...filter, celestialObject: e.target.value })
          }
          placeholder="请输入天体名称"
          className="w-full dark:bg-gray-700 dark:text-gray-200"
        />
      </motion.div>

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

      {/* 高级筛选开关 */}
      <Button
        variant="ghost"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className="mt-4 w-full md:w-auto"
      >
        {showAdvancedFilters ? "隐藏高级筛选" : "显示高级筛选"}
      </Button>

      {/* 高级筛选选项 */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Created Date Range Filter */}
            <div className="flex flex-col">
              <Label className="mb-1 text-sm font-medium dark:text-gray-300">
                创建日期范围
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={filter.createdDateStart}
                  onChange={(e) =>
                    setFilter({ ...filter, createdDateStart: e.target.value })
                  }
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
                <Input
                  type="date"
                  value={filter.createdDateEnd}
                  onChange={(e) =>
                    setFilter({ ...filter, createdDateEnd: e.target.value })
                  }
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Modified Date Range Filter */}
            <div className="flex flex-col">
              <Label className="mb-1 text-sm font-medium dark:text-gray-300">
                修改日期范围
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={filter.modifiedDateStart}
                  onChange={(e) =>
                    setFilter({ ...filter, modifiedDateStart: e.target.value })
                  }
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
                <Input
                  type="date"
                  value={filter.modifiedDateEnd}
                  onChange={(e) =>
                    setFilter({ ...filter, modifiedDateEnd: e.target.value })
                  }
                  className="w-full dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
