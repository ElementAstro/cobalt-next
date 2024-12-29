"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, Search, Sun, Moon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  exportData: () => void;
  importData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNewSite: () => void;
  onSearch: (query: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
  // 自定义设置相关
  setBackgroundColor: (color: string) => void;
  setLayoutMode: (mode: 'grid' | 'list') => void;
  setCardStyle: (style: 'default' | 'minimal' | 'detailed') => void;
}

const Header: React.FC<HeaderProps> = ({
  exportData,
  importData,
  onAddNewSite,
  onSearch,
  setBackgroundColor,
  setLayoutMode,
  setCardStyle,
}) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-300 dark:text-indigo-400">
          Cobalt Hub
        </h1>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial sm:w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <Input
            type="search"
            placeholder="搜索站点..."
            className="pl-8 bg-indigo-800/50 border-indigo-600"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={exportData}
          className="bg-indigo-700 hover:bg-indigo-600 text-white"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Export data</span>
        </Button>
        <Label htmlFor="import-data">
          <Button
            variant="outline"
            size="icon"
            className="bg-indigo-700 hover:bg-indigo-600 text-white"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Import data</span>
          </Button>
        </Label>
        <Input
          id="import-data"
          type="file"
          accept=".json"
          onChange={importData}
          className="hidden"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={onAddNewSite}
            >
              <Plus className="mr-2 h-4 w-4" /> 添加新站点
            </Button>
          </DialogTrigger>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-indigo-700 hover:bg-indigo-600 text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">设置</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-indigo-800 border-indigo-600">
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setBackgroundColor("from-indigo-900 to-purple-900")}
            >
              默认背景
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setBackgroundColor("from-blue-900 to-cyan-900")}
            >
              蓝色背景
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setBackgroundColor("from-green-900 to-teal-900")}
            >
              绿色背景
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setLayoutMode("grid")}
            >
              网格布局
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setLayoutMode("list")}
            >
              列表布局
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setCardStyle("default")}
            >
              默认卡片样式
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setCardStyle("minimal")}
            >
              简约卡片样式
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-indigo-700 focus:bg-indigo-700"
              onClick={() => setCardStyle("detailed")}
            >
              详细卡片样式
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default Header;
