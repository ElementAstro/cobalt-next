import { useState, useMemo, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CategorySection } from "@/components/toolpanel/CategorySection";
import { ToolDetail } from "@/components/toolpanel/ToolDetail";
import {
  Image,
  Wand2,
  SendHorizonal,
  Webhook,
  Cloud,
  Paperclip,
} from "lucide-react";
import { Tool } from "@/types/toolpanel";
import SearchBar from "@/components/custom/SearchBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ClientInfo from "./ClientInfo";
import AllINDIPanel from "./INDIPanel";
import HttpTester from "./HttpClient";
import OnlineStorage from "./OnlineStorage";
import ScriptsPage from "./Scripts";
import SerialMonitor from "./SerialMonitor";
import SoftwareManagement from "./Software";
import WeatherInfo from "./WeatherInfo";
import TerminalPage from "./Terminal";
import TodoList from "./TodoList";
import { Button } from "@/components/ui/button";

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );
  return newArray;
}

const CATEGORY_ORDER = ["媒体", "数据", "客户端", "人工智能", "系统", "基础"];

const initialTools: Tool[] = [
  {
    id: "1",
    name: "图片处理",
    description: "处理和编辑图片",
    icon: Image,
    usageCount: 0,
    category: "媒体",
  },
  {
    id: "2",
    name: "软件管理",
    description: "管理本地软件",
    icon: Wand2,
    usageCount: 0,
    category: "系统",
    CustomComponent: SoftwareManagement,
  },
  {
    id: "3",
    name: "待办事项",
    description: "管理待办事项",
    icon: Wand2,
    usageCount: 0,
    category: "基础",
    CustomComponent: TodoList,
  },
  {
    id: "4",
    name: "HTTP 测试",
    description: "测试 HTTP 请求",
    icon: Webhook,
    usageCount: 0,
    category: "客户端",
    CustomComponent: HttpTester,
  },
  {
    id: "5",
    name: "终端",
    description: "终端命令行",
    icon: SendHorizonal,
    usageCount: 0,
    category: "系统",
    CustomComponent: TerminalPage,
  },
  {
    id: "6",
    name: "存储管理",
    description: "管理本地存储",
    icon: Wand2,
    usageCount: 0,
    category: "基础",
    CustomComponent: OnlineStorage,
  },
  {
    id: "7",
    name: "天气信息",
    description: "获取天气信息",
    icon: Webhook,
    usageCount: 0,
    category: "数据",
    CustomComponent: (props) => <WeatherInfo {...props} onClose={() => {}} />,
  },
  {
    id: "8",
    name: "INDI 面板",
    description: "INDI 设备控制面板",
    icon: Cloud,
    usageCount: 0,
    category: "客户端",
    CustomComponent: AllINDIPanel,
  },
  {
    id: "9",
    name: "串口助手",
    description: "基础串口调试助手",
    icon: SendHorizonal,
    usageCount: 0,
    category: "系统",
    CustomComponent: SerialMonitor,
  },
  {
    id: "10",
    name: "客户端信息",
    description: "客户端信息面板",
    icon: Webhook,
    usageCount: 0,
    category: "基础",
    CustomComponent: ClientInfo,
  },
  {
    id: "11",
    name: "脚本管理",
    description: "管理脚本",
    icon: Paperclip,
    usageCount: 0,
    category: "系统",
    CustomComponent: ScriptsPage,
  },
];

export default function ToolPanel() {
  const [tools, setTools] = useState(initialTools);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isLandscape, setIsLandscape] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ORDER[0]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Add hotkeys for quick navigation
  useHotkeys("ctrl+f", (e) => {
    e.preventDefault();
    (
      document.querySelector('input[type="search"]') as HTMLInputElement
    )?.focus();
  });

  useHotkeys("esc", () => {
    if (selectedTool) setSelectedTool(null);
  });

  CATEGORY_ORDER.forEach((category, index) => {
    useHotkeys(`ctrl+${index + 1}`, () => {
      const tabTrigger = document.querySelector(`[value="${category}"]`);
      if (tabTrigger instanceof HTMLElement) {
        tabTrigger.click();
        toast({
          title: `切换到${category}分类`,
          duration: 1500,
        });
      }
    });
  });

  // 添加键盘快捷键
  useHotkeys("mod+p", (e) => {
    e.preventDefault();
    // 实现命令面板
  });

  useHotkeys("mod+b", () => {
    // 切换侧边栏
  });

  const handleSelectTool = (id: string) => {
    setSelectedTool(id);
    setTools((prevTools) =>
      prevTools.map((tool) =>
        tool.id === id ? { ...tool, usageCount: tool.usageCount + 1 } : tool
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setTools((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const activeItem = items[oldIndex];
          const overItem = items[newIndex];

          if (activeItem.category === overItem.category) {
            return arrayMove(items, oldIndex, newIndex);
          }
        }

        return items;
      });
    }
  };

  const filteredTools = useMemo(
    () =>
      tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tools, searchTerm]
  );

  if (selectedTool) {
    const tool = tools.find((t) => t.id === selectedTool);
    return tool ? (
      <ToolDetail
        id={tool.id}
        name={tool.name}
        icon={tool.icon}
        onBack={() => setSelectedTool(null)}
        onUse={handleSelectTool}
        CustomComponent={tool.CustomComponent}
      />
    ) : null;
  }

  return (
    <div className={`h-full flex ${isLandscape ? "flex-row" : "flex-col"}`}>
      {isLandscape && (
        <nav className="w-64 bg-gray-900 p-4 hidden lg:block">
          <div className="space-y-4">
            {CATEGORY_ORDER.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="mr-2">{category}</span>
                <kbd className="ml-auto text-xs opacity-50">⌘{index + 1}</kbd>
              </Button>
            ))}
          </div>
        </nav>
      )}

      <main className="flex-1 overflow-hidden">
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="flex flex-col h-full"
        >
          <div className="sticky top-0 z-50 bg-gray-900 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {!isLandscape && (
                <TabsList className="flex-wrap justify-start">
                  {CATEGORY_ORDER.map((category, index) => (
                    <TooltipProvider key={category}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger value={category}>
                            {category}
                            <span className="ml-2 opacity-50 text-xs hidden sm:inline">
                              ⌘{index + 1}
                            </span>
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{`${category}工具 (⌘${index + 1})`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TabsList>
              )}
              <SearchBar
                initialSuggestions={tools.map((tool) => tool.name)}
                onSearch={setSearchTerm}
                disabled={false}
                placeholder="搜索工具... (⌘F)"
                variant="minimal"
                className={isLandscape ? "w-full" : "w-full sm:w-72"}
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {CATEGORY_ORDER.map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="transition-all duration-300 h-full"
              >
                <ScrollArea className="h-full">
                  <DndContext onDragEnd={handleDragEnd}>
                    <motion.div
                      className={`p-4 bg-gray-800 ${
                        isLandscape ? "flex-row" : "flex-col"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CategorySection
                        category={category}
                        tools={filteredTools.filter(
                          (tool) => tool.category === category
                        )}
                        onSelectTool={handleSelectTool}
                      />
                    </motion.div>
                  </DndContext>
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
