"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileText, Plus, Trash, Search } from "lucide-react";
import { ActiveScripts } from "./components/active-scripts";
import { ScriptList } from "./components/script-list";
import { api } from "@/services/script";
import { Script, Job } from "@/types/script";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [useMockApi, setUseMockApi] = useState(false);
  const [newScriptName, setNewScriptName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.setMockMode(useMockApi);
    fetchData();
  }, [useMockApi]);

  const fetchData = async () => {
    try {
      const [fetchedScripts, fetchedJobs] = await Promise.all([
        api.fetchScripts(),
        api.fetchJobs(),
      ]);
      setScripts(fetchedScripts);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "错误",
        description: "获取数据失败，请稍后重试。",
        variant: "destructive",
      });
    }
  };

  const handleCreateScript = async () => {
    if (newScriptName) {
      try {
        await api.createScript({ name: newScriptName });
        setNewScriptName("");
        fetchData();
        toast({
          title: "成功",
          description: "脚本创建成功。",
        });
      } catch (error) {
        console.error("Error creating script:", error);
        toast({
          title: "错误",
          description: "创建脚本失败。",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteScripts = async () => {
    try {
      await Promise.all(selectedScripts.map((id) => api.deleteScript(id)));
      setSelectedScripts([]);
      fetchData();
      toast({
        title: "成功",
        description: "选中的脚本已删除。",
      });
    } catch (error) {
      console.error("Error deleting scripts:", error);
      toast({
        title: "错误",
        description: "删除脚本失败。",
        variant: "destructive",
      });
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-tight">仪表板</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={useMockApi}
            onCheckedChange={setUseMockApi}
            id="mock-mode"
          />
          <Label htmlFor="mock-mode">模拟 API</Label>
          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建脚本
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新脚本</DialogTitle>
                <DialogDescription>
                  输入新脚本的名称。您可以稍后编辑内容。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    名称
                  </Label>
                  <Input
                    id="name"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                    className="col-span-3"
                    placeholder="输入脚本名称"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateScript} disabled={!newScriptName}>
                  创建脚本
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {selectedScripts.length > 0 && (
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Tooltip>
                  <Button variant="destructive" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>确认删除</DialogTitle>
                  <DialogDescription>
                    您确定要删除选中的脚本吗？此操作无法撤销。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={handleDeleteScripts}>确认</Button>
                  <Button
                    onClick={() => setIsConfirmOpen(false)}
                    variant="ghost"
                  >
                    取消
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总脚本数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scripts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">活跃脚本</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter((job) => job.status === "Running").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">今日完成</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                jobs.filter(
                  (job) =>
                    job.status === "Completed" &&
                    new Date(job.startTime).toDateString() ===
                      new Date().toDateString()
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">失败脚本</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.filter((job) => job.status === "Failed").length}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>活跃脚本</CardTitle>
            <Input
              type="text"
              placeholder="搜索脚本..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/3"
              // 移除 icon 属性，因为 Input 组件不支持
            />
          </CardHeader>
          <CardContent>
            <ActiveScripts
              jobs={jobs.filter((job) => job.status === "Running")}
            />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>近期脚本</CardTitle>
            <CardDescription>本周运行了 {jobs.length} 个脚本</CardDescription>
          </CardHeader>
          <CardContent>
            <ScriptList
              scripts={filteredScripts}
              selectedScripts={selectedScripts}
              setSelectedScripts={setSelectedScripts}
            />
          </CardContent>
        </Card>
      </div>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除选中的脚本吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDeleteScripts}>确认</Button>
            <Button onClick={() => setIsConfirmOpen(false)} variant="ghost">
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
