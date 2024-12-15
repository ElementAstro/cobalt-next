import { useState, useMemo } from "react";
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
    <Tabs defaultValue={CATEGORY_ORDER[0]} className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-900">
        <TabsList className="w-full md:w-auto">
          {CATEGORY_ORDER.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <SearchBar
          initialSuggestions={tools.map((tool) => tool.name)}
          onSearch={(term) => setSearchTerm(term)}
          disabled={false}
          placeholder="搜索工具..."
          variant="minimal"
          className="w-full md:w-1/3"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        {CATEGORY_ORDER.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="transition-opacity duration-500 ease-in-out p-4 h-full"
          >
            <ScrollArea className="overflow-y-auto h-full">
              <DndContext onDragEnd={handleDragEnd}>
                <motion.div
                  className="p-4 bg-gray-800 flex flex-col md:flex-row flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
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
  );
}
