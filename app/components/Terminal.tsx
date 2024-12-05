"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RotateCcw, Download, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

interface CommandHistory {
  command: string;
  timestamp: string;
  status: "success" | "error" | "running";
  output: string;
}

const THEMES = {
  default: "bg-background text-foreground",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black",
  blue: "bg-blue-900 text-blue-100",
  red: "bg-red-900 text-red-100",
  green: "bg-green-900 text-green-100",
};

const themeOptions = Object.keys(THEMES) as Array<keyof typeof THEMES>;

export default function TerminalPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "欢迎使用增强终端。请输入命令。",
  ]);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>(() => {
    const saved = localStorage.getItem("commandHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof THEMES>("dark");
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

  useEffect(() => {
    localStorage.setItem("commandHistory", JSON.stringify(commandHistory));
  }, [commandHistory]);

  useEffect(() => {
    if (terminalRef.current) {
      const xterm = new Terminal({
        theme: {
          background: selectedTheme === "dark" ? "#1e1e1e" : "#ffffff",
          foreground: selectedTheme === "dark" ? "#ffffff" : "#000000",
        },
      });
      xterm.open(terminalRef.current);
      xterm.write("欢迎使用增强终端。请输入命令。\r\n");
      xtermRef.current = xterm;

      xterm.onData((data) => {
        setInput((prev) => prev + data);
      });
    }

    return () => {
      xtermRef.current?.dispose();
    };
  }, [selectedTheme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const executeCommand = async (command: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (command.toLowerCase().trim()) {
      case "help":
        return "可用命令: help, echo, date, clear, theme, history, exit, version, greet";
      case "echo":
        return "用法: echo <消息>";
      case "date":
        return new Date().toLocaleString();
      case "clear":
        setOutput([]);
        return "";
      case "theme":
        return `可用主题: ${Object.keys(THEMES).join(
          ", "
        )}\n用法: theme <主题名称>`;
      case "history":
        return "显示命令历史记录。";
      case "version":
        return "终端版本 2.0.0";
      case "exit":
        return "退出终端...";
      case "greet":
        return "你好！欢迎使用增强终端。";
      default:
        if (command.toLowerCase().startsWith("echo ")) {
          return command.slice(5);
        }
        if (command.toLowerCase().startsWith("theme ")) {
          const newTheme = command.slice(6).trim() as keyof typeof THEMES;
          if (THEMES[newTheme]) {
            setSelectedTheme(newTheme);
            return `主题已更改为 ${newTheme}`;
          } else {
            return `无效的主题。可用主题: ${Object.keys(THEMES).join(", ")}`;
          }
        }
        return `未找到命令: ${command}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isExecuting) {
      setIsExecuting(true);
      const newOutput = [...output, `$ ${input}`];
      setOutput(newOutput);
      xtermRef.current?.writeln(`$ ${input}`);

      const newCommand: CommandHistory = {
        command: input,
        timestamp: new Date().toLocaleTimeString(),
        status: "running",
        output: "",
      };
      setCommandHistory([newCommand, ...commandHistory]);

      try {
        const commandOutput = await executeCommand(input);
        const updatedOutput = commandOutput
          ? [...newOutput, commandOutput]
          : newOutput;
        setOutput(updatedOutput);
        xtermRef.current?.writeln(commandOutput);

        newCommand.status = "success";
        newCommand.output = commandOutput;
      } catch (error) {
        const errorMessage = `错误: ${(error as Error).message}`;
        setOutput([...newOutput, errorMessage]);
        xtermRef.current?.writeln(errorMessage);

        newCommand.status = "error";
        newCommand.output = errorMessage;
      } finally {
        setCommandHistory([
          { ...newCommand, timestamp: new Date().toLocaleTimeString() },
          ...commandHistory,
        ]);
        setInput("");
        setIsExecuting(false);
      }
    }
  };

  const handleClearTerminal = () => {
    setOutput([]);
    setCommandHistory([]);
    localStorage.removeItem("commandHistory");
    xtermRef.current?.clear();
  };

  const handleDownloadHistory = () => {
    const historyText = commandHistory
      .map(
        (cmd) =>
          `${cmd.timestamp} - ${cmd.command} (${cmd.status})\n${cmd.output}`
      )
      .join("\n\n");
    const blob = new Blob([historyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "terminal_history.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <motion.div
      className="flex flex-col space-y-4 p-2 md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center flex-wrap gap-2"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">终端</h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Select
            value={selectedTheme}
            onValueChange={(value) =>
              setSelectedTheme(value as keyof typeof THEMES)
            }
          >
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <SelectValue placeholder="主题" />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearTerminal}
            title="清除终端"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownloadHistory}
            title="下载历史记录"
          >
            <Download className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="md:col-span-1">
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-lg md:text-xl">交互式终端</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div
              className={cn(
                "h-[40vh] md:h-[60vh] w-full rounded-md border overflow-hidden",
                THEMES[selectedTheme]
              )}
              ref={terminalRef}
            ></div>
            <form
              onSubmit={handleSubmit}
              className="mt-2 md:mt-4 flex space-x-2"
            >
              <Input
                type="text"
                placeholder="输入命令..."
                value={input}
                onChange={handleInputChange}
                className="flex-grow text-sm md:text-base"
                disabled={isExecuting}
                autoFocus
              />
              <Button
                type="submit"
                disabled={isExecuting}
                className="text-sm md:text-base"
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
                ) : (
                  "运行"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-lg md:text-xl">命令历史记录</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">历史</TabsTrigger>
                <TabsTrigger value="details">详情</TabsTrigger>
              </TabsList>
              <TabsContent value="history">
                <ScrollArea className="h-[30vh] md:h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%] text-sm md:text-base">
                          命令
                        </TableHead>
                        <TableHead className="w-[30%] text-sm md:text-base">
                          时间
                        </TableHead>
                        <TableHead className="w-[30%] text-sm md:text-base">
                          状态
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commandHistory.map((cmd, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs md:text-sm">
                            {cmd.command}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {cmd.timestamp}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            {cmd.status === "success" ? (
                              <Check className="inline text-green-500" />
                            ) : cmd.status === "error" ? (
                              <X className="inline text-red-500" />
                            ) : (
                              <Loader2 className="inline text-yellow-500 animate-spin" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="details">
                <ScrollArea className="h-[30vh] md:h-[50vh]">
                  {commandHistory.length > 0 && (
                    <motion.div
                      className="space-y-2 md:space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-bold text-sm md:text-base">
                        最近命令详情
                      </h3>
                      <p className="text-xs md:text-sm">
                        <strong>命令:</strong> {commandHistory[0].command}
                      </p>
                      <p className="text-xs md:text-sm">
                        <strong>执行时间:</strong> {commandHistory[0].timestamp}
                      </p>
                      <p className="text-xs md:text-sm">
                        <strong>状态:</strong>{" "}
                        <span
                          className={
                            commandHistory[0].status === "success"
                              ? "text-green-500"
                              : commandHistory[0].status === "error"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }
                        >
                          {commandHistory[0].status === "success"
                            ? "成功"
                            : commandHistory[0].status === "error"
                            ? "错误"
                            : "运行中"}
                        </span>
                      </p>
                      <p className="text-xs md:text-sm">
                        <strong>输出:</strong>
                      </p>
                      <pre className="bg-gray-800 text-white p-2 rounded text-xs md:text-sm whitespace-pre-wrap">
                        {commandHistory[0].output}
                      </pre>
                    </motion.div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
