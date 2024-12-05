"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Edit,
  Trash,
  Check,
  X,
  Plus,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface Script {
  id: number;
  name: string;
  content: string;
  status: "idle" | "running" | "paused";
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: 1,
      name: "Backup Database",
      content: "#!/bin/bash\n# Backup script",
      status: "idle",
    },
    {
      id: 2,
      name: "Update User Permissions",
      content: "#!/bin/bash\n# Update permissions script",
      status: "idle",
    },
    {
      id: 3,
      name: "Generate Report",
      content: "#!/bin/bash\n# Generate report script",
      status: "idle",
    },
  ]);
  const [newScript, setNewScript] = useState({ name: "", content: "" });
  const [editScript, setEditScript] = useState<Script | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedScripts = localStorage.getItem("scripts");
    if (savedScripts) {
      setScripts(JSON.parse(savedScripts));
    }
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scripts", JSON.stringify(scripts));
  }, [scripts]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleCreateScript = () => {
    if (newScript.name && newScript.content) {
      setScripts([
        ...scripts,
        { id: Date.now(), ...newScript, status: "idle" },
      ]);
      setNewScript({ name: "", content: "" });
    }
  };

  const handleDeleteScript = (id: number) => {
    if (confirm("您确定要删除这个脚本吗？")) {
      setScripts(scripts.filter((script) => script.id !== id));
    }
  };

  const handleRunScript = (id: number) => {
    setScripts(
      scripts.map((script) =>
        script.id === id ? { ...script, status: "running" } : script
      )
    );
    // 模拟脚本运行
    setTimeout(() => {
      setScripts(
        scripts.map((script) =>
          script.id === id ? { ...script, status: "idle" } : script
        )
      );
    }, 2000);
  };

  const handlePauseScript = (id: number) => {
    setScripts(
      scripts.map((script) =>
        script.id === id ? { ...script, status: "paused" } : script
      )
    );
  };

  const handleEditScript = (script: Script) => {
    setEditScript(script);
  };

  const saveEditedScript = () => {
    if (editScript) {
      setScripts(
        scripts.map((script) =>
          script.id === editScript.id ? editScript : script
        )
      );
      setEditScript(null);
    }
  };

  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="flex flex-col space-y-4 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center flex-wrap gap-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          脚本管理
        </h1>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="搜索脚本..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建新脚本
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新脚本</DialogTitle>
                <DialogDescription>输入新脚本的名称和内容。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right text-gray-700 dark:text-gray-300"
                  >
                    名称
                  </Label>
                  <Input
                    id="name"
                    value={newScript.name}
                    onChange={(e) =>
                      setNewScript({ ...newScript, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="输入脚本名称"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label
                    htmlFor="content"
                    className="text-right mt-2 text-gray-700 dark:text-gray-300"
                  >
                    内容
                  </Label>
                  <Textarea
                    id="content"
                    value={newScript.content}
                    onChange={(e) =>
                      setNewScript({ ...newScript, content: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="输入脚本内容"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateScript}
                  disabled={!newScript.name || !newScript.content}
                >
                  创建脚本
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={toggleDarkMode} variant="ghost">
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              您的脚本
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    名称
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    状态
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {script.name}
                    </TableCell>
                    <TableCell>
                      {script.status === "running" ? (
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>运行中</span>
                        </div>
                      ) : script.status === "paused" ? (
                        <div className="flex items-center space-x-1 text-orange-500">
                          <Pause className="h-4 w-4" />
                          <span>已暂停</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-green-500">
                          <Check className="h-4 w-4" />
                          <span>空闲</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {script.status !== "running" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRunScript(script.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>运行脚本</TooltipContent>
                          </Tooltip>
                        )}
                        {script.status === "running" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePauseScript(script.id)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>暂停脚本</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditScript(script)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>编辑脚本</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteScript(script.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>删除脚本</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {editScript && (
        <Dialog open={!!editScript} onOpenChange={() => setEditScript(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑脚本</DialogTitle>
              <DialogDescription>修改脚本的名称和内容。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="edit-name"
                  className="text-right text-gray-700 dark:text-gray-300"
                >
                  名称
                </Label>
                <Input
                  id="edit-name"
                  value={editScript.name}
                  onChange={(e) =>
                    setEditScript({ ...editScript, name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="输入脚本名称"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="edit-content"
                  className="text-right mt-2 text-gray-700 dark:text-gray-300"
                >
                  内容
                </Label>
                <Textarea
                  id="edit-content"
                  value={editScript.content}
                  onChange={(e) =>
                    setEditScript({ ...editScript, content: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="输入脚本内容"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEditedScript}
                disabled={!editScript.name || !editScript.content}
              >
                保存修改
              </Button>
              <Button onClick={() => setEditScript(null)} variant="ghost">
                取消
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
