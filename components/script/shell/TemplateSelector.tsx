import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store/scripts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, Info } from "lucide-react";

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
echo "内存信息: $(free -h | grep 'Mem:' | awk '{print $2}')"`,
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
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
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
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(template);
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorites((prev) =>
                        prev.includes(template.name)
                          ? prev.filter((name) => name !== template.name)
                          : [...prev, template.name]
                      );
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(template.name)
                          ? "fill-current text-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mt-4"
          >
            <h3 className="font-bold mb-2">{showPreview.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {showPreview.description}
            </p>
            <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm">
              {showPreview.code}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowPreview(null)}
            >
              关闭预览
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateSelector;
