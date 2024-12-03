"use client";

import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Buffer } from "buffer";
import { motion } from "framer-motion";

import TitleBar from "../../components/serial/TitleBar";
import ConsoleArea from "../../components/serial/ConsoleArea";
import ControlButtons from "../../components/serial/ControlButtons";
import CommandInput from "../../components/serial/CommandInput";
import CustomCommands from "../../components/serial/CustomCommands";
import ConfigurationPanel from "../../components/serial/ConfigurationPanel";
import StatusBar from "../../components/serial/StatusBar";

import { MockSerialService } from "@/services/mock-serial";
import { RealSerialService } from "@/services/real-serial";
import {
  SerialConfig,
  SerialData,
  SerialState,
  SerialPort,
  Theme,
} from "@/types/serial";

export default function SerialMonitor() {
  const [state, setState] = useState<SerialState>({
    ports: [],
    activePortId: null,
  });
  const [isMockMode, setIsMockMode] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isHexView, setIsHexView] = useState(false);
  const [customCommands, setCustomCommands] = useState<string[]>([]);
  const serialServices = useRef<{
    [key: string]: MockSerialService | RealSerialService;
  }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAutoScroll && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [state.ports, isAutoScroll]);

  const scanPorts = async () => {
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
      // 添加其他端口...
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

    toast.success("端口扫描成功");
  };

  useEffect(() => {
    scanPorts();
  }, [isMockMode]);

  const handleConnect = async () => {
    const portId = state.activePortId;
    if (!portId) return;
    const port = state.ports.find((p) => p.id === portId);
    if (!port) return;

    try {
      if (port.isConnected) {
        await serialServices.current[portId].disconnect();
        toast.success(`已断开 ${port.name}`);
      } else {
        await serialServices.current[portId].connect(port.config);
        toast.success(`已连接到 ${port.name}`);
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
      console.error("连接错误:", error);
      toast.error(`无法 ${port.isConnected ? "断开" : "连接到"} ${port.name}`);
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
      toast.success("命令发送成功");
    } catch (error) {
      console.error("发送错误:", error);
      toast.error("发送命令失败");
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
    toast.success("控制台已清空");
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
    toast.success(`${key} 已更新为 ${portId}`);
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
    toast.success("日志已保存");
  };

  const addCustomCommand = () => {
    if (inputCommand.trim()) {
      setCustomCommands((prev) => [...prev, inputCommand.trim()]);
      setInputCommand("");
      toast.success("自定义命令已添加");
    }
  };

  const removeCustomCommand = (index: number) => {
    setCustomCommands((prev) => prev.filter((_, i) => i !== index));
    toast.success("自定义命令已移除");
  };

  const scrollUp = () => {
    textareaRef.current?.scrollBy(0, -100);
  };

  const scrollDown = () => {
    textareaRef.current?.scrollBy(0, 100);
  };

  return (
    <motion.div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-right" />
      <TitleBar
        ports={state.ports}
        activePortId={state.activePortId}
        onPortChange={(value) =>
          setState((prev) => ({ ...prev, activePortId: value }))
        }
        onRefresh={scanPorts}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <motion.div
        className={`flex-1 p-4 flex ${
          isLandscape ? "flex-row" : "flex-col"
        } gap-4`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={`${isLandscape ? "w-2/3" : "w-full"}`}>
          <ConsoleArea
            data={
              state.activePortId
                ? state.ports.find((p) => p.id === state.activePortId)?.data ||
                  []
                : []
            }
            showTimestamp={showTimestamp}
            isHexView={isHexView}
            isLandscape={isLandscape}
            textareaRef={textareaRef}
            scrollUp={scrollUp}
            scrollDown={scrollDown}
          />
          <ControlButtons
            onConnect={handleConnect}
            isConnected={
              state.activePortId
                ? state.ports.find((p) => p.id === state.activePortId)
                    ?.isConnected || false
                : false
            }
            onClear={handleClear}
            showTimestamp={showTimestamp}
            toggleTimestamp={() => setShowTimestamp(!showTimestamp)}
            onSaveLog={handleSaveLog}
            isAutoScroll={isAutoScroll}
            toggleAutoScroll={() => setIsAutoScroll(!isAutoScroll)}
            isHexView={isHexView}
            toggleHexView={() => setIsHexView(!isHexView)}
            rxCount={
              state.activePortId
                ? state.ports.find((p) => p.id === state.activePortId)
                    ?.rxCount || 0
                : 0
            }
            txCount={
              state.activePortId
                ? state.ports.find((p) => p.id === state.activePortId)
                    ?.txCount || 0
                : 0
            }
          />
          <CommandInput
            inputCommand={inputCommand}
            onInputChange={(e) => setInputCommand(e.target.value)}
            onSend={handleSend}
            onAddCustom={addCustomCommand}
          />
          <CustomCommands
            commands={customCommands}
            onSend={handleSend}
            onRemove={removeCustomCommand}
          />
        </div>
        <motion.div
          className={`${isLandscape ? "w-1/3" : "w-full"}`}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ConfigurationPanel
            isMockMode={isMockMode}
            toggleMockMode={setIsMockMode}
            activePort={
              state.activePortId
                ? state.ports.find((p) => p.id === state.activePortId)
                : undefined
            }
            onConfigChange={handleConfigChange}
          />
          <StatusBar isMockMode={isMockMode} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
