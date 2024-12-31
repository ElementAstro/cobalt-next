"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/store/useScriptStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, Info, Star, Bookmark, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Template {
  name: string;
  category: string;
  code: string;
  description: string;
}

const templates: Template[] = [
  // 基础模板
  {
    name: "基础脚本",
    category: "基础",
    code: "#!/bin/bash\n\n# 脚本说明\n# 作者：\n# 日期：\n\n# 你的代码\n",
    description: "基础的脚本模板，包含必要的声明和注释",
  },

  // 循环结构
  {
    name: "For 循环",
    category: "循环",
    code: "for i in {1..5}\ndo\n    echo $i\ndone\n",
    description: "基本的数字遍历循环",
  },
  {
    name: "While 循环",
    category: "循环",
    code: "counter=1\nwhile [ $counter -le 5 ]\ndo\n    echo $counter\n    ((counter++))\ndone\n",
    description: "基于条件的 while 循环",
  },

  // 条件判断
  {
    name: "If 语句",
    category: "条件",
    code: "if [ condition ]; then\n    # do something\nelif [ condition2 ]; then\n    # do something else\nelse\n    # default action\nfi\n",
    description: "完整的 if-elif-else 条件判断",
  },

  // 文件操作
  {
    name: "文件检查",
    category: "文件",
    code: `if [ -f "$file" ]; then
    echo "文件存在"
elif [ -d "$file" ]; then
    echo "目录存在"
else
    echo "文件不存在"
fi`,
    description: "检查文件或目录是否存在",
  },

  // 系统管理
  {
    name: "系统信息",
    category: "系统",
    code: `#!/bin/bash
echo "系统信息:"
echo "主机名: $(hostname)"
echo "内核版本: $(uname -r)"
echo "CPU信息: $(lscpu | grep 'Model name' | cut -f 2 -d ":")"
echo "内存信息: $(free -h | grep 'Mem:' | awk '{print $2}')`,
    description: "获取基本系统信息",
  },

  // 文本处理
  {
    name: "文本处理",
    category: "文本",
    code: `#!/bin/bash
# 文本处理示例
file="example.txt"
echo "行数统计: $(wc -l < $file)"
echo "单词统计: $(wc -w < $file)"
echo "查找特定文本:"
grep "pattern" $file`,
    description: "常用文本处理操作",
  },
];

interface TemplateSelectorProps {
  onInsert: (template: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onInsert }) => {
  const { theme } = useEditorStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<Template | null>(null);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const categories = useMemo(
    () => Array.from(new Set(["全部", ...templates.map((t) => t.category)])),
    []
  );

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "全部" || template.category === selectedCategory;
      const isFavorite = favorites.includes(template.name);
      return matchesSearch && matchesCategory && (!showFavorites || isFavorite);
    });
  }, [search, selectedCategory, favorites, showFavorites]);

  const toggleFavorite = (templateName: string) => {
    setFavorites((prev) =>
      prev.includes(templateName)
        ? prev.filter((name) => name !== templateName)
        : [...prev, templateName]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 搜索和过滤 */}
      <div className="space-y-3">
        <Label>搜索模板</Label>
        <div className="flex gap-2">
          <Input
            placeholder="搜索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={showFavorites ? "secondary" : "ghost"}
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-1"
          >
            <Heart className="h-4 w-4" />
            {showFavorites ? "显示全部" : "显示收藏"}
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              {showFavorites
                ? "只显示收藏的模板"
                : "显示所有模板或仅收藏的模板"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 分类选择 */}
      <div className="space-y-3">
        <Label>选择分类</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 模板列表 */}
      <div className="space-y-3">
        <Label>模板列表</Label>
        <Select
          onValueChange={(value) => {
            const template = templates.find((t) => t.name === value);
            if (template) {
              onInsert(template.code);
            }
          }}
        >
          <SelectTrigger
            className={`w-full ${theme === "dark" ? "dark" : "light"}`}
          >
            <SelectValue placeholder="选择一个模板" />
          </SelectTrigger>
          <SelectContent>
            {filteredTemplates.map((template) => (
              <SelectItem
                key={template.name}
                value={template.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {template.name}
                  {favorites.includes(template.name) && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template.name);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(template.name)
                          ? "fill-current text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(template);
                    }}
                  >
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 模板详情预览 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mt-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">{showPreview.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(null)}
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {showPreview.description}
            </p>
            <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
              {showPreview.code}
            </pre>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(null)}>
                关闭
              </Button>
              <Button
                onClick={() => {
                  onInsert(showPreview.code);
                  setShowPreview(null);
                }}
              >
                插入代码
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 高级功能 - 分类管理 */}
      <Accordion type="multiple" className="mt-6">
        <AccordionItem value="advanced-options">
          <AccordionTrigger>高级选项</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* 新增模板 */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">新增模板</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>新增模板</DialogTitle>
                    <DialogDescription>
                      填写以下信息以创建新的模板。
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // 实现新增模板逻辑
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="template-name">模板名称</Label>
                      <Input id="template-name" placeholder="名称" required />
                    </div>
                    <div>
                      <Label htmlFor="template-category">类别</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择类别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map(
                              (category) =>
                                category !== "全部" && (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="template-description">描述</Label>
                      <Input
                        id="template-description"
                        placeholder="描述"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="template-code">代码</Label>
                      <textarea
                        id="template-code"
                        placeholder="代码内容"
                        className="w-full h-32 p-2 bg-gray-200 dark:bg-gray-700 rounded"
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // 关闭对话框逻辑
                        }}
                      >
                        取消
                      </Button>
                      <Button type="submit">保存</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* 分类管理 */}
              <Accordion type="single" collapsible>
                <AccordionItem value="manage-categories">
                  <AccordionTrigger>管理分类</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <Label>新增分类</Label>
                      <div className="flex gap-2">
                        <Input placeholder="分类名称" />
                        <Button>添加</Button>
                      </div>
                      <Label>现有分类</Label>
                      <ul className="list-disc list-inside">
                        {categories.map(
                          (category) =>
                            category !== "全部" && (
                              <li
                                key={category}
                                className="flex justify-between items-center"
                              >
                                <span>{category}</span>
                                <Button variant="ghost" size="icon">
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default TemplateSelector;
