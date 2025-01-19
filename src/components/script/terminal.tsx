"use client";

import { useEffect, useRef } from "react";
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
import { Loader2, RotateCcw, Download, Check, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { LigaturesAddon } from '@xterm/addon-ligatures';
import "@xterm/xterm/css/xterm.css";

import {
  useTerminalStore,
  CommandHistory,
  THEMES,
} from "@/store/useScriptStore";

export default function TerminalPage() {
  const {
    input,
    setInput,
    output,
    addOutput,
    commandHistory,
    addCommandHistory,
    isExecuting,
    setExecuting,
    selectedTheme,
    setTheme,
    clearTerminal,
    downloadHistory,
  } = useTerminalStore();

  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const searchAddonRef = useRef<SearchAddon | null>(null);
  const webLinksAddonRef = useRef<WebLinksAddon | null>(null);
  const unicode11AddonRef = useRef<Unicode11Addon | null>(null);
  const ligaturesAddonRef = useRef<LigaturesAddon | null>(null);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      // 初始化插件
      const fitAddon = new FitAddon();
      const searchAddon = new SearchAddon();
      const webLinksAddon = new WebLinksAddon((event: MouseEvent, uri: string) => {
        window.open(uri, '_blank');
      });
      const unicode11Addon = new Unicode11Addon();
      const ligaturesAddon = new LigaturesAddon();

      const xterm = new XTerm({
        theme: {
          background: THEMES[selectedTheme],
          foreground: THEMES[selectedTheme].includes("dark")
            ? "#ffffff"
            : "#000000",
        },
        cursorBlink: true,
        fontSize: 14,
        fontFamily: '"Cascadia Code", "Fira Code", monospace',
        allowProposedApi: true,
        allowTransparency: true,
        letterSpacing: 1,
        lineHeight: 1.2,
      });

      // 加载插件
      xterm.loadAddon(fitAddon);
      xterm.loadAddon(searchAddon);
      xterm.loadAddon(webLinksAddon);
      xterm.loadAddon(unicode11Addon);
      xterm.loadAddon(ligaturesAddon);

      xterm.open(terminalRef.current);
      xterm.write("欢迎使用增强终端。请输入命令。\r\n");
      xtermRef.current = xterm;

      // 存储插件引用
      fitAddonRef.current = fitAddon;
      searchAddonRef.current = searchAddon;
      webLinksAddonRef.current = webLinksAddon;
      unicode11AddonRef.current = unicode11Addon;
      ligaturesAddonRef.current = ligaturesAddon;

      // 初始化调整大小
      fitAddon.fit();

      // 处理窗口大小变化
      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener('resize', handleResize);

      xterm.onData((data) => {
        setInput((prevInput: string) => prevInput + data);
      });

      // 添加鼠标点击支持
      const handleMouseClick = (e: MouseEvent) => {
        if (e.ctrlKey && xtermRef.current) {
          const cursorY = xtermRef.current.buffer.active.cursorY;
          const cursorX = xtermRef.current.buffer.active.cursorX;
          xtermRef.current.write(`\x1b[${cursorY + 1};${cursorX + 1}H`);
          xtermRef.current.write('\x1b[?25h'); // 显示光标
        }
      };
      terminalRef.current?.addEventListener('click', handleMouseClick);

      // 添加快捷键支持
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.key === 'f') {
            const searchValue = prompt('请输入要搜索的内容');
            if (searchValue && searchAddonRef.current) {
              searchAddonRef.current.findNext(searchValue);
            }
          } else if (e.key === 'm') {
            // 切换多光标模式
            if (xtermRef.current) {
              xtermRef.current.options.cursorStyle = 'bar';
              xtermRef.current.options.cursorBlink = true;
              xtermRef.current.write('\x1b[?1003h'); // 启用鼠标报告
              addOutput('多光标模式已启用。使用 Ctrl+点击添加新光标');
            }
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        xtermRef.current?.dispose();
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        terminalRef.current?.removeEventListener('click', handleMouseClick);
      };
    }
  }, [selectedTheme, setInput]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = async (command: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (command.toLowerCase().trim()) {
      case "help":
        return "可用命令: help, echo, date, clear, theme, history, exit, version, greet, info, upgrade";
      case "echo":
        return "用法: echo <消息>";
      case "date":
        return new Date().toLocaleString();
      case "clear":
        clearTerminal();
        return "";
      case "theme":
        return `可用主题: ${Object.keys(THEMES).join(
          ", "
        )}\n用法: theme <主题名称>`;
      case "history":
        return "显示命令历史记录。";
      case "version":
        return "终端版本 2.1.0";
      case "exit":
        return "退出终端...";
      case "greet":
        return "你好！欢迎使用增强终端。";
      case "info":
        return "增强终端 v2.1.0\n开发者: Cobalt团队\n功能丰富且可定制。";
      case "upgrade":
        return "正在检查更新...\n已是最新版本。";
      default:
        if (command.toLowerCase().startsWith("echo ")) {
          return command.slice(5);
        }
        if (command.toLowerCase().startsWith("theme ")) {
          const newTheme = command.slice(6).trim() as keyof typeof THEMES;
          if (THEMES[newTheme]) {
            setTheme(newTheme);
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
      setExecuting(true);
      addOutput(`$ ${input}`);
      xtermRef.current?.writeln(`$ ${input}`);

      const newCommand: CommandHistory = {
        command: input,
        timestamp: new Date().toLocaleTimeString(),
        status: "running",
        output: "",
      };
      addCommandHistory(newCommand);

      try {
        const commandOutput = await executeCommand(input);
        if (commandOutput) {
          addOutput(commandOutput);
          xtermRef.current?.writeln(commandOutput);
          newCommand.status = "success";
          newCommand.output = commandOutput;
        } else {
          newCommand.status = "success";
          newCommand.output = "";
        }
      } catch (error) {
        let errorMessage = `错误: ${(error as Error).message}`;
        
        // 错误分类
        if (error instanceof SyntaxError) {
          errorMessage = `语法错误: ${error.message}\n建议检查命令格式`;
        } else if (error instanceof TypeError) {
          errorMessage = `类型错误: ${error.message}\n建议检查参数类型`;
        } else if (error instanceof RangeError) {
          errorMessage = `范围错误: ${error.message}\n建议检查输入范围`;
        } else if (error instanceof URIError) {
          errorMessage = `URI错误: ${error.message}\n建议检查URL格式`;
        } else if (error instanceof ReferenceError) {
          errorMessage = `引用错误: ${error.message}\n建议检查变量或函数名`;
        }

        // 添加恢复建议
        errorMessage += `\n\n恢复建议:
1. 检查命令拼写
2. 确保参数正确
3. 使用 help 查看可用命令
4. 联系管理员获取支持`;

        addOutput(errorMessage);
        xtermRef.current?.writeln(errorMessage);
        newCommand.status = "error";
        newCommand.output = errorMessage;
      } finally {
        addCommandHistory({
          ...newCommand,
          timestamp: new Date().toLocaleTimeString(),
        });
        setInput("");
        setExecuting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <motion.div
      className="flex flex-col space-y-4 p-2 md:p-4 bg-gray-900 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }}
    >
      <motion.div
        className="flex justify-between items-center flex-wrap gap-2"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">增强终端</h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Select
            value={selectedTheme}
            onValueChange={(value) => setTheme(value as keyof typeof THEMES)}
          >
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <SelectValue placeholder="主题" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(THEMES).map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={clearTerminal}
            title="清除终端"
          >
            <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const searchValue = prompt('请输入要搜索的内容');
              if (searchValue && searchAddonRef.current) {
                searchAddonRef.current.findNext(searchValue);
              }
            }}
            title="搜索"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={downloadHistory}
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
        <Card className="md:col-span-1 bg-gray-800 shadow-lg">
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-lg md:text-xl text-white">
              交互式终端
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div
              className={cn(
                "h-[40vh] md:h-[60vh] w-full rounded-md border overflow-hidden",
                THEMES[selectedTheme]
              )}
              ref={terminalRef}
              style={{
                fontSize: 'clamp(12px, 1.5vw, 16px)',
                lineHeight: '1.5',
                padding: '0.5rem'
              }}
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
                className="flex-grow text-sm md:text-base bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                disabled={isExecuting}
                autoFocus
              />
              <Button
                type="submit"
                disabled={isExecuting}
                className="text-sm md:text-base flex items-center justify-center"
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
        <Card className="md:col-span-1 bg-gray-800 shadow-lg">
          <CardHeader className="p-2 md:p-4">
            <CardTitle className="text-lg md:text-xl text-white">
              命令历史记录
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700 rounded-md">
                <TabsTrigger value="history" className="text-white">
                  历史
                </TabsTrigger>
                <TabsTrigger value="details" className="text-white">
                  详情
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="p-2 md:p-4">
                <ScrollArea className="h-[30vh] md:h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%] text-sm md:text-base text-white">
                          命令
                        </TableHead>
                        <TableHead className="w-[30%] text-sm md:text-base text-white">
                          时间
                        </TableHead>
                        <TableHead className="w-[30%] text-sm md:text-base text-white">
                          状态
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commandHistory.map((cmd, index) => (
                        <TableRow key={index} className="hover:bg-gray-700">
                          <TableCell className="font-mono text-xs md:text-sm text-white">
                            {cmd.command}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm text-white">
                            {cmd.timestamp}
                          </TableCell>
                          <TableCell className="text-xs md:text-sm text-white">
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
              <TabsContent value="details" className="p-2 md:p-4">
                <ScrollArea className="h-[30vh] md:h-[50vh]">
                  {commandHistory.length > 0 && (
                    <motion.div
                      className="space-y-2 md:space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-bold text-sm md:text-base text-white">
                        最近命令详情
                      </h3>
                      <p className="text-xs md:text-sm text-white">
                        <strong>命令:</strong> {commandHistory[0].command}
                      </p>
                      <p className="text-xs md:text-sm text-white">
                        <strong>执行时间:</strong> {commandHistory[0].timestamp}
                      </p>
                      <p className="text-xs md:text-sm text-white">
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
                      <p className="text-xs md:text-sm text-white">
                        <strong>输出:</strong>
                      </p>
                      <pre className="bg-gray-700 text-white p-2 rounded text-xs md:text-sm whitespace-pre-wrap">
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
      <motion.div
        className="flex justify-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          variant="secondary"
          onClick={() => {
            setTheme("dark");
            addOutput("主题已切换为暗色模式。\r\n");
            xtermRef.current?.writeln("主题已切换为暗色模式。");
          }}
        >
          切换到暗色模式
        </Button>
      </motion.div>
    </motion.div>
  );
}
