"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, RefreshCw, X, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  ScanHistory,
  ScanResult,
  usePortScanStore,
} from "@/store/useConnectionStore";
import logger from "@/utils/logger";

const commonPorts: { [key: number]: string } = {
  21: "FTP",
  22: "SSH",
  80: "HTTP",
  443: "HTTPS",
  3306: "MySQL",
  5432: "PostgreSQL",
  8080: "HTTP Alternate",
  27017: "MongoDB",
  6379: "Redis",
};

const ServerPortScanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    progress,
    status,
    isScanning,
    scanResults,
    ipAddress,
    portRange,
    customPortRange,
    scanSpeed,
    timeout,
    concurrentScans,
    showClosedPorts,
    scanHistory,
    selectedInterface,
    networkInterfaces,
    resetScan,
    setIpAddress,
    setPortRange,
    setProgress,
    setStatus,
    setIsScanning,
    setScanResults,
    setCustomPortRange,
    setScanSpeed,
    setTimeoutValue,
    setConcurrentScans,
    setShowClosedPorts,
    setScanHistory,
    setSelectedInterface,
    setNetworkInterfaces,
  } = usePortScanStore();

  useEffect(() => {
    if (isOpen && !isScanning) {
      resetScan();
      fetchNetworkInterfaces();
    }
  }, [isOpen]);

  const fetchNetworkInterfaces = async () => {
    try {
      const response = await fetch("/api/network-interfaces");
      if (response.ok) {
        const interfaces = await response.json();
        setNetworkInterfaces(interfaces);
        if (interfaces.length > 0) {
          setSelectedInterface(interfaces[0]);
        }
        logger.info("Fetched network interfaces", { interfaces });
      } else {
        throw new Error("无法获取网络接口");
      }
    } catch (error: any) {
      console.error("获取网络接口失败:", error);
      logger.error("Failed to fetch network interfaces", error);
      toast({
        title: "错误",
        description: error.message || "获取网络接口失败",
        variant: "destructive",
      });
    }
  };

  const getPorts = () => {
    switch (portRange) {
      case "common":
        return Array.from({ length: 1000 }, (_, i) => i + 1);
      case "all":
        return Array.from({ length: 65535 }, (_, i) => i + 1);
      case "custom":
        const ranges = customPortRange
          .split(",")
          .map((r) => r.split("-").map(Number));
        let ports: number[] = [];
        ranges.forEach(([start, end]) => {
          ports = ports.concat(
            Array.from({ length: end - start + 1 }, (_, i) => i + start)
          );
        });
        return ports;
      default:
        return [];
    }
  };

  const ipSchema = z
    .string()
    .regex(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "请输入有效的IP地址"
    );

  const scanPort = async (ip: string, port: number, timeout: number) => {
    return new Promise((resolve) => {
      const socket = new WebSocket(`ws://${ip}:${port}`);
      const timer = setTimeout(() => {
        socket.close();
        resolve({ port, status: "closed" });
      }, timeout);

      socket.onopen = () => {
        clearTimeout(timer);
        socket.close();
        resolve({ port, status: "open" });
      };

      socket.onerror = () => {
        clearTimeout(timer);
        resolve({ port, status: "closed" });
      };
    });
  };

  const startScan = async () => {
    try {
      ipSchema.parse(ipAddress);
    } catch (error: any) {
      toast({
        title: "错误",
        description: error.message,
        variant: "destructive",
      });
      logger.error("IP address validation failed", error.message);
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setScanResults([]);
    setStatus("正在扫描...");

    const ports = getPorts();
    const totalPorts = ports.length;
    let scannedPorts = 0;

    logger.info("Starting port scan", { ipAddress, totalPorts });

    for (let i = 0; i < totalPorts; i += concurrentScans) {
      const batch = ports.slice(i, i + concurrentScans);
      try {
        const results = await Promise.all(
          batch.map((port) => scanPort(ipAddress, port, timeout))
        );

        scannedPorts += batch.length;
        setProgress((scannedPorts / totalPorts) * 100);

        const currentResults = scanResults;
        const updatedResults = [
          ...currentResults,
          ...(results as ScanResult[])
            .map((r) => ({
              ...r,
              service:
                r.status === "open" ? commonPorts[r.port] || "未知" : undefined,
            }))
            .filter((r) => showClosedPorts || r.status === "open"),
        ];

        setScanResults(updatedResults);
        logger.info("Batch scan results", { batch, results });
      } catch (error: any) {
        console.error("扫描错误:", error);
        logger.error("Port scan error", error);
        toast({
          title: "扫描错误",
          description: error.message || "端口扫描过程中发生错误",
          variant: "destructive",
        });
        setIsScanning(false);
        setStatus("扫描出错");
        return;
      }
    }

    setIsScanning(false);
    setStatus("扫描完成");
    saveScanHistory();
    toast({
      title: "扫描完成",
      description: `成功扫描了 ${totalPorts} 个端口`,
    });
    logger.info("Port scan completed", { totalPorts });
  };

  const saveScanHistory = () => {
    const newScan: ScanHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      ipAddress,
      openPorts: scanResults.filter((r) => r.status === "open").length,
    };
    setScanHistory([newScan, ...scanHistory]);
    logger.info("Scan history saved", { newScan });
  };

  const exportToCSV = () => {
    try {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Port,Status,Service\n" +
        scanResults
          .map(
            (result) =>
              `${result.port},${result.status},${result.service || ""}`
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `port_scan_${ipAddress}_${new Date().toISOString()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "导出成功",
        description: "扫描结果已成功导出为CSV文件",
      });
      logger.info("Scan results exported to CSV", { ipAddress });
    } catch (error: any) {
      console.error("导出CSV失败:", error);
      logger.error("Export to CSV failed", error);
      toast({
        title: "导出失败",
        description: error.message || "扫描结果导出过程中发生错误",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 dark:bg-opacity-75 overflow-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative max-h-screen overflow-y-auto text-gray-100"
          >
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-100">
              <Shield className="mr-2 text-blue-500" />
              服务器端口扫描
            </h2>
            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scan">扫描</TabsTrigger>
                <TabsTrigger value="results">结果</TabsTrigger>
                <TabsTrigger value="history">历史</TabsTrigger>
              </TabsList>
              <TabsContent value="scan">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ip-address">IP地址</Label>
                      <Input
                        id="ip-address"
                        placeholder="例如: 192.168.1.1"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        disabled={isScanning}
                      />
                    </div>
                    <div>
                      <Label htmlFor="network-interface">网络接口</Label>
                      <Select
                        value={selectedInterface}
                        onValueChange={setSelectedInterface}
                      >
                        <SelectTrigger id="network-interface">
                          <SelectValue placeholder="选择网络接口" />
                        </SelectTrigger>
                        <SelectContent>
                          {networkInterfaces.map((iface) => (
                            <SelectItem key={iface} value={iface}>
                              {iface}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>端口范围</Label>
                      <RadioGroup
                        value={portRange}
                        onValueChange={setPortRange}
                        className="space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="common"
                            id="common"
                            disabled={isScanning}
                          />
                          <Label htmlFor="common">常用端口 (1-1000)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="all"
                            id="all"
                            disabled={isScanning}
                          />
                          <Label htmlFor="all">所有端口 (1-65535)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="custom"
                            id="custom"
                            disabled={isScanning}
                          />
                          <Label htmlFor="custom">自定义</Label>
                        </div>
                      </RadioGroup>
                      {portRange === "custom" && (
                        <Input
                          className="mt-2"
                          placeholder="例如: 1-100,200-300"
                          value={customPortRange}
                          onChange={(e) => setCustomPortRange(e.target.value)}
                          disabled={isScanning}
                        />
                      )}
                    </div>

                    <div>
                      <Label htmlFor="scan-speed">扫描速度</Label>
                      <Select value={scanSpeed} onValueChange={setScanSpeed}>
                        <SelectTrigger id="scan-speed">
                          <SelectValue placeholder="选择扫描速度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fast">
                            快速 (100ms 超时)
                          </SelectItem>
                          <SelectItem value="normal">
                            正常 (500ms 超时)
                          </SelectItem>
                          <SelectItem value="thorough">
                            彻底 (2000ms 超时)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeout" className="flex justify-between">
                        超时设置
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {timeout}ms
                        </span>
                      </Label>
                      <Slider
                        id="timeout"
                        min={100}
                        max={5000}
                        step={100}
                        value={[timeout]}
                        onValueChange={(value) => setTimeoutValue(value[0])}
                        disabled={isScanning}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="concurrent-scans"
                        className="flex justify-between"
                      >
                        并发扫描数
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {concurrentScans}
                        </span>
                      </Label>
                      <Slider
                        id="concurrent-scans"
                        min={1}
                        max={100}
                        step={1}
                        value={[concurrentScans]}
                        onValueChange={(value) => setConcurrentScans(value[0])}
                        disabled={isScanning}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-closed-ports"
                        checked={showClosedPorts}
                        onCheckedChange={setShowClosedPorts}
                        disabled={isScanning}
                      />
                      <Label htmlFor="show-closed-ports">显示关闭的端口</Label>
                    </div>
                    <Button
                      onClick={startScan}
                      disabled={isScanning || !ipAddress}
                      className="min-w-[120px]"
                    >
                      {isScanning ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Shield className="mr-2 h-4 w-4" />
                      )}
                      {isScanning ? "扫描中..." : "开始扫描"}
                    </Button>
                  </div>

                  <div>
                    <Label className="mb-2">扫描进度</Label>
                    <motion.div
                      className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </motion.div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {status}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="results">
                {scanResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="overflow-y-auto max-h-96"
                  >
                    <Table className="min-w-full">
                      <TableCaption>扫描结果</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>端口</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>服务</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scanResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{result.port}</TableCell>
                            <TableCell>
                              {result.status === "open" ? "开放" : "关闭"}
                            </TableCell>
                            <TableCell>{result.service || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        导出CSV
                      </Button>
                      <Button onClick={saveScanHistory}>
                        <Save className="mr-2 h-4 w-4" />
                        保存结果
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    暂无扫描结果
                  </p>
                )}
              </TabsContent>
              <TabsContent value="history">
                {scanHistory.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="overflow-y-auto max-h-96"
                  >
                    <Table className="min-w-full">
                      <TableCaption>扫描历史</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>日期</TableHead>
                          <TableHead>IP地址</TableHead>
                          <TableHead>开放端口数</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scanHistory.map((history) => (
                          <TableRow key={history.id}>
                            <TableCell>{history.date}</TableCell>
                            <TableCell>{history.ipAddress}</TableCell>
                            <TableCell>{history.openPorts}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </motion.div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    暂无扫描历史
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServerPortScanModal;
