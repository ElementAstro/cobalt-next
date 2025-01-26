"use client";

import { useScriptStore } from "../../store/useScriptStore";
import { useEffect, useState } from "react";
import ScriptList from "../../components/script/script-list";
import JsonNode from "../../components/script/json-node";
import { Button } from "@/components/ui/button";
import {
  Save,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Copy,
  Trash2,
  FileDown,
  FileUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  BarChart,
  Plus,
  File,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 颜色常量
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ScriptPage() {
  const { scripts, selectedScript, selectScript, updateScript, deleteScript } =
    useScriptStore();
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("editor");

  useEffect(() => {
    if (selectedScript) {
      setIsEditing(true);
    }
  }, [selectedScript]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-1 p-1 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            title="Save (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7" title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7" title="Import">
            <FileUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7" title="Export">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            onClick={() => setFontSize((s) => s + 1)}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            onClick={() => setFontSize((s) => Math.max(8, s - 1))}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7"
            onClick={() => setFontSize(14)}
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="hidden md:flex items-center gap-2"
          onClick={() => setIsCommandOpen(true)}
        >
          <Search className="w-4 h-4" />
          <span>搜索命令... </span>
          <kbd className="text-xs bg-gray-800 px-2 rounded">⌘K</kbd>
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setIsStatsOpen(true)}>
          <BarChart className="w-4 h-4" />
        </Button>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-1 gap-2 p-2 overflow-hidden">
        <div className="w-64 shrink-0 overflow-hidden">
          <ScriptList scripts={scripts} onSelectScript={selectScript} />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="editor">编辑器</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
              <TabsTrigger value="history">历史</TabsTrigger>
              <TabsTrigger value="stats">统计</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="h-[calc(100vh-120px)]">
              {isEditing && selectedScript ? (
                <div className="h-full flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div
                    className="flex-1 overflow-auto p-4"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <JsonNode
                      data={selectedScript}
                      path={[]}
                      onchange={(path: string[], value: any) => {
                        if (selectedScript) {
                          const updatedScript = { ...selectedScript, ...value };
                          updateScript(selectedScript.id, updatedScript);
                        }
                      }}
                      ondelete={(path: string[]) => {
                        if (
                          selectedScript &&
                          window.confirm(
                            "Are you sure you want to delete this script?"
                          )
                        ) {
                          deleteScript(selectedScript.id);
                          selectScript("");
                        }
                      }}
                      onAddChild={(path: string[]) => {
                        if (selectedScript) {
                          const newScript = {
                            ...selectedScript,
                            [path.join(".")]: "",
                          };
                          updateScript(selectedScript.id, newScript);
                        }
                      }}
                    />
                  </div>
                  <div className="p-2 border-t text-xs text-muted-foreground flex items-center justify-between">
                    <span>Line: 1 | Column: 1</span>
                    <span>{selectedScript.id}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Select a script to edit</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="h-[calc(100vh-120px)]">
              <div className="h-full overflow-auto bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm">
                  {selectedScript?.content || "No content"}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="history" className="h-[calc(100vh-120px)]">
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {selectedScript?.history?.map((record, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-3 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span>
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                        <Badge
                          variant={
                            record.status === "completed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <pre className="text-xs bg-gray-900 p-2 rounded">
                        {record.output}
                      </pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="stats" className="h-[calc(100vh-120px)]">
              <div className="grid grid-cols-2 gap-4 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>执行次数统计</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={scripts.map((s) => ({
                          name: s.name,
                          executions: s.executionCount || 0,
                        }))}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="executions" fill="#8884d8" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>成功率统计</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "成功",
                              value: selectedScript?.successCount || 0,
                            },
                            {
                              name: "失败",
                              value: selectedScript?.failureCount || 0,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="输入命令或搜索..." />
        <CommandList>
          <CommandEmpty>未找到结果</CommandEmpty>
          <CommandGroup heading="常用操作">
            <CommandItem
              onSelect={() => {
                /* 实现新建脚本 */
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              新建脚本
            </CommandItem>
            <CommandItem
              onSelect={() => {
                /* 实现导入脚本 */
              }}
            >
              <FileUp className="mr-2 h-4 w-4" />
              导入脚本
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="快捷跳转">
            {scripts.map((script) => (
              <CommandItem
                key={script.id}
                onSelect={() => {
                  selectScript(script.id);
                  setIsCommandOpen(false);
                }}
              >
                <File className="mr-2 h-4 w-4" />
                {script.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Sheet open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>脚本统计</SheetTitle>
            <SheetDescription>查看脚本使用情况和执行统计</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>使用趋势</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      selectedScript?.executionHistory?.map((h) => ({
                        date: new Date(h.timestamp).toLocaleDateString(),
                        count: h.count,
                      })) || []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="执行次数"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
