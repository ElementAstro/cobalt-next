"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Save,
  Upload,
  RefreshCwIcon as Refresh,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MockSerialService } from "@/services/mock-serial";
import { RealSerialService } from "@/services/real-serial";
import {
  SerialConfig,
  SerialData,
  SerialState,
  SerialPort,
  Theme,
} from "@/types/serial";
import { toast, Toaster } from "react-hot-toast";

const lightTheme: Theme = {
  primary: "bg-blue-600",
  secondary: "bg-gray-200",
  background: "bg-white",
  text: "text-gray-900",
};

const darkTheme: Theme = {
  primary: "bg-blue-800",
  secondary: "bg-gray-700",
  background: "bg-gray-900",
  text: "text-gray-100",
};

export default function SerialMonitor() {
  const [state, setState] = useState<SerialState>({
    ports: [],
    activePortId: null,
  });
  const [isMockMode, setIsMockMode] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isHexView, setIsHexView] = useState(false);
  const [customCommands, setCustomCommands] = useState<string[]>([]);
  const serialServices = useRef<{
    [key: string]: MockSerialService | RealSerialService;
  }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAutoScroll && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [state.ports, isAutoScroll]);

  const scanPorts = async () => {
    // In a real implementation, this would use the Web Serial API or a backend service
    // For this example, we'll simulate finding some ports
    const mockPorts: SerialPort[] = [
      {
        id: "COM1",
        name: "COM1",
        isConnected: false,
        config: { baudRate: 9600, dataBits: 8, stopBits: 1, parity: "none" },
        data: [],
        rxCount: 0,
        txCount: 0,
      },
      {
        id: "COM2",
        name: "COM2",
        isConnected: false,
        config: { baudRate: 115200, dataBits: 8, stopBits: 1, parity: "none" },
        data: [],
        rxCount: 0,
        txCount: 0,
      },
      {
        id: "COM3",
        name: "COM3",
        isConnected: false,
        config: { baudRate: 9600, dataBits: 8, stopBits: 1, parity: "none" },
        data: [],
        rxCount: 0,
        txCount: 0,
      },
    ];

    setState((prevState) => ({
      ...prevState,
      ports: mockPorts,
      activePortId: prevState.activePortId || mockPorts[0].id,
    }));

    mockPorts.forEach((port) => {
      serialServices.current[port.id] = isMockMode
        ? new MockSerialService()
        : new RealSerialService();
    });

    toast.success("Ports scanned successfully");
  };

  useEffect(() => {
    scanPorts();
  }, [isMockMode]);

  const handleConnect = async (portId: string) => {
    const port = state.ports.find((p) => p.id === portId);
    if (!port) return;

    try {
      if (port.isConnected) {
        await serialServices.current[portId].disconnect();
        toast.success(`Disconnected from ${port.name}`);
      } else {
        await serialServices.current[portId].connect(port.config);
        toast.success(`Connected to ${port.name}`);
      }

      setState((prevState) => ({
        ...prevState,
        ports: prevState.ports.map((p) =>
          p.id === portId ? { ...p, isConnected: !p.isConnected } : p
        ),
      }));

      if (!port.isConnected) {
        serialServices.current[portId].onReceive((data: SerialData) => {
          setState((prevState) => ({
            ...prevState,
            ports: prevState.ports.map((p) =>
              p.id === portId
                ? {
                    ...p,
                    data: [...p.data, data],
                    rxCount: p.rxCount + 1,
                  }
                : p
            ),
          }));
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(
        `Failed to ${port.isConnected ? "disconnect from" : "connect to"} ${
          port.name
        }`
      );
    }
  };

  const handleSend = async (command: string = inputCommand) => {
    if (!state.activePortId) return;
    const activePort = state.ports.find((p) => p.id === state.activePortId);
    if (!activePort || !activePort.isConnected || !command.trim()) return;

    try {
      await serialServices.current[state.activePortId].send(command);
      setState((prevState) => ({
        ...prevState,
        ports: prevState.ports.map((p) =>
          p.id === state.activePortId
            ? {
                ...p,
                data: [
                  ...p.data,
                  { type: "tx", data: command, timestamp: Date.now() },
                ],
                txCount: p.txCount + 1,
              }
            : p
        ),
      }));
      setInputCommand("");
      toast.success("Command sent successfully");
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to send command");
    }
  };

  const handleClear = () => {
    if (!state.activePortId) return;
    setState((prevState) => ({
      ...prevState,
      ports: prevState.ports.map((p) =>
        p.id === state.activePortId ? { ...p, data: [] } : p
      ),
    }));
    toast.success("Console cleared");
  };

  const handleConfigChange = (
    portId: string,
    key: keyof SerialConfig,
    value: any
  ) => {
    setState((prevState) => ({
      ...prevState,
      ports: prevState.ports.map((p) =>
        p.id === portId ? { ...p, config: { ...p.config, [key]: value } } : p
      ),
    }));
    toast.success(`${key} updated for ${portId}`);
  };

  const handleSaveLog = () => {
    if (!state.activePortId) return;
    const activePort = state.ports.find((p) => p.id === state.activePortId);
    if (!activePort) return;

    const logContent = activePort.data
      .map(
        (item) =>
          `${
            showTimestamp ? new Date(item.timestamp).toISOString() + " " : ""
          }${item.type.toUpperCase()}: ${
            isHexView ? Buffer.from(item.data).toString("hex") : item.data
          }`
      )
      .join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `serial_log_${activePort.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Log saved successfully");
  };

  const addCustomCommand = () => {
    if (inputCommand.trim()) {
      setCustomCommands((prev) => [...prev, inputCommand.trim()]);
      setInputCommand("");
      toast.success("Custom command added");
    }
  };

  const removeCustomCommand = (index: number) => {
    setCustomCommands((prev) => prev.filter((_, i) => i !== index));
    toast.success("Custom command removed");
  };

  const activePort = state.ports.find((p) => p.id === state.activePortId);

  return (
    <div
      className={`min-h-screen flex flex-col ${theme.background} ${theme.text}`}
    >
      <Toaster position="top-right" />
      {/* Title Bar */}
      <div className={`flex items-center justify-between ${theme.primary} p-2`}>
        <div className="flex items-center gap-2">
          <Select
            value={state.activePortId || ""}
            onValueChange={(value) =>
              setState((prevState) => ({ ...prevState, activePortId: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a port" />
            </SelectTrigger>
            <SelectContent>
              {state.ports.map((port) => (
                <SelectItem key={port.id} value={port.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        port.isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {port.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={scanPorts}>
            <Refresh className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-white" />
            ) : (
              <Moon className="h-4 w-4 text-white" />
            )}
          </Button>
          <button className="text-white hover:bg-blue-700 px-2">✕</button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 flex ${
          isLandscape ? "flex-row" : "flex-col"
        } gap-4`}
      >
        <div className={`${isLandscape ? "w-2/3" : "w-full"}`}>
          {/* Console Area */}
          <Card
            className={`flex-1 ${theme.secondary} border-blue-600 relative mb-4`}
          >
            <Textarea
              ref={textareaRef}
              className={`${
                isLandscape ? "h-[calc(100vh-10rem)]" : "h-[50vh]"
              } resize-none bg-transparent border-none focus-visible:ring-0 text-green-400`}
              readOnly
              value={
                activePort
                  ? activePort.data
                      .map(
                        (item) =>
                          `${
                            showTimestamp
                              ? new Date(item.timestamp).toISOString() + " "
                              : ""
                          }${item.type.toUpperCase()}: ${
                            isHexView
                              ? Buffer.from(item.data).toString("hex")
                              : item.data
                          }`
                      )
                      .join("\n")
                  : ""
              }
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => textareaRef.current?.scrollBy(0, -100)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => textareaRef.current?.scrollBy(0, 100)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activePort?.isConnected ? "destructive" : "default"}
              onClick={() => activePort && handleConnect(activePort.id)}
              disabled={!activePort}
            >
              {activePort?.isConnected ? "断开" : "连接"}
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              清屏
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTimestamp(!showTimestamp)}
            >
              <Label className="h-4 w-4">T</Label>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSaveLog}>
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant={isAutoScroll ? "default" : "secondary"}
              onClick={() => setIsAutoScroll(!isAutoScroll)}
            >
              自动滚动
            </Button>
            <Button
              variant={isHexView ? "default" : "secondary"}
              onClick={() => setIsHexView(!isHexView)}
            >
              Hex 视图
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <span>RX {activePort?.rxCount || 0}</span>
              <span>TX {activePort?.txCount || 0}</span>
            </div>
          </div>

          {/* Command Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="输入命令..."
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button variant="outline" onClick={() => handleSend()}>
              发送
            </Button>
            <Button variant="outline" onClick={addCustomCommand}>
              <Plus className="h-4 w-4 mr-2" />
              添加
            </Button>
          </div>

          {/* Custom Commands */}
          <div className="mt-4 flex flex-wrap gap-2">
            {customCommands.map((cmd, index) => (
              <div key={index} className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => handleSend(cmd)}>
                  {cmd}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomCommand(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isLandscape ? "w-1/3" : "w-full"}`}>
          <Card className={`p-4 ${theme.secondary}`}>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mock-mode">Mock 模式</Label>
                <Switch
                  id="mock-mode"
                  checked={isMockMode}
                  onCheckedChange={setIsMockMode}
                />
              </div>
              {activePort && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="baud-rate">波特率</Label>
                      <Select
                        value={activePort.config.baudRate.toString()}
                        onValueChange={(value) =>
                          handleConfigChange(
                            activePort.id,
                            "baudRate",
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger id="baud-rate">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9600">9600</SelectItem>
                          <SelectItem value="115200">115200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="data-bits">数据位</Label>
                      <Select
                        value={activePort.config.dataBits.toString()}
                        onValueChange={(value) =>
                          handleConfigChange(
                            activePort.id,
                            "dataBits",
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger id="data-bits">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stop-bits">停止位</Label>
                      <Select
                        value={activePort.config.stopBits.toString()}
                        onValueChange={(value) =>
                          handleConfigChange(
                            activePort.id,
                            "stopBits",
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger id="stop-bits">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="parity">校验位</Label>
                      <Select
                        value={activePort.config.parity}
                        onValueChange={(value: "none" | "even" | "odd") =>
                          handleConfigChange(activePort.id, "parity", value)
                        }
                      >
                        <SelectTrigger id="parity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="even">Even</SelectItem>
                          <SelectItem value="odd">Odd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Status Bar */}
          <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" size="sm">
              STR
            </Button>
            <span className="ml-auto">
              {isMockMode ? "Mock 模式已启用" : "实际串口模式"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
