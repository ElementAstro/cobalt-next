"use client";

import React, { useState, useEffect } from "react";
import { Cog, RefreshCcw, Power, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDomeStore } from "@/lib/store/device/dome";
import { domeApi } from "@/services/device/dome";
import { mockDomeApi } from "@/utils/mock-dome";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const api =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ? mockDomeApi : domeApi;

export default function DomeSimulator() {
  const {
    azimuth,
    shutterStatus,
    isConnected,
    isSynced,
    isSlewing,
    error,
    setAzimuth,
    setShutterStatus,
    setConnected,
    setSynced,
    setSlewing,
    setError,
  } = useDomeStore();

  const [targetAzimuth, setTargetAzimuth] = useState(azimuth);

  useEffect(() => {
    setTargetAzimuth(azimuth);
  }, [azimuth]);

  const handleConnect = async () => {
    try {
      await api.connect();
      setConnected(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.disconnect();
      setConnected(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSlewToAzimuth = async () => {
    try {
      setSlewing(true);
      await api.setAzimuth(targetAzimuth);
      setSlewing(false);
      setAzimuth(targetAzimuth);
    } catch (err) {
      setSlewing(false);
      setError((err as Error).message);
    }
  };

  const handleOpenShutter = async () => {
    try {
      await api.openShutter();
      setShutterStatus("open");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCloseShutter = async () => {
    try {
      await api.closeShutter();
      setShutterStatus("closed");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSync = async () => {
    try {
      await api.sync();
      setSynced(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFindHome = async () => {
    try {
      await api.findHome();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStop = async () => {
    try {
      await api.stop();
      setSlewing(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePark = async () => {
    try {
      await api.park();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cog className="h-6 w-6" />
            罩棚
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleConnect}
              disabled={isConnected}
              aria-label="连接罩棚"
            >
              <Power className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDisconnect}
              disabled={!isConnected}
              aria-label="断开罩棚连接"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="icon" aria-label="设置">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>系统设置</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
            aria-live="assertive"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* 信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>模拟器信息</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeader>属性</TableHeader>
                  <TableHeader>值</TableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">连接状态</TableCell>
                  <TableCell>{isConnected ? "已连接" : "未连接"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">方位角</TableCell>
                  <TableCell>{azimuth}°</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">快门状态</TableCell>
                  <TableCell>{shutterStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">翘曲中</TableCell>
                  <TableCell>{isSlewing ? "是" : "否"}</TableCell>
                </TableRow>
                {/* 额外信息 */}
                <TableRow>
                  <TableCell className="font-medium">同步状态</TableCell>
                  <TableCell>{isSynced ? "同步" : "未同步"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">当前位置</TableCell>
                  <TableCell>北纬23°，东经45°</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 控制部分 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 同步控制 */}
          <Card>
            <CardHeader>
              <CardTitle>同步控制</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="sync-toggle">罩棚跟随望远镜</Label>
                <Switch
                  id="sync-toggle"
                  checked={isSynced}
                  onCheckedChange={handleSync}
                  disabled={!isConnected}
                  aria-label="切换同步"
                />
                <span className="text-sm text-muted-foreground">
                  {isSynced ? "开启" : "关闭"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 手动控制 */}
          <Card>
            <CardHeader>
              <CardTitle>手动控制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleOpenShutter}
                  disabled={
                    !isConnected ||
                    shutterStatus === "open" ||
                    shutterStatus === "opening"
                  }
                  aria-label="打开快门"
                >
                  打开快门
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleCloseShutter}
                  disabled={
                    !isConnected ||
                    shutterStatus === "closed" ||
                    shutterStatus === "closing"
                  }
                  aria-label="关闭快门"
                >
                  关闭快门
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setTargetAzimuth(Math.max(0, targetAzimuth - 1))
                  }
                  disabled={!isConnected}
                  aria-label="减少方位角"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={targetAzimuth}
                  onChange={(e) => setTargetAzimuth(Number(e.target.value))}
                  className="w-20 text-center"
                  disabled={!isConnected}
                  aria-label="目标方位角"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setTargetAzimuth(Math.min(360, targetAzimuth + 1))
                  }
                  disabled={!isConnected}
                  aria-label="增加方位角"
                >
                  +
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSlewToAzimuth}
                  disabled={!isConnected || isSlewing}
                  aria-label="翘曲到方位角"
                >
                  翘曲
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 额外信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>附加信息</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeader>属性</TableHeader>
                  <TableHeader>值</TableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">电源状态</TableCell>
                  <TableCell>{isConnected ? "开启" : "关闭"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">维护模式</TableCell>
                  <TableCell>正常</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">系统时间</TableCell>
                  <TableCell>2024-04-27 12:34:56</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">固件版本</TableCell>
                  <TableCell>v1.2.3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 底部操作按钮 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button
            variant="default"
            className="w-full"
            onClick={handleSync}
            disabled={!isConnected}
            aria-label="同步"
          >
            同步
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleFindHome}
            disabled={!isConnected}
            aria-label="寻找归位"
          >
            寻找归位
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleStop}
            disabled={!isConnected}
            aria-label="停止"
          >
            停止
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handlePark}
            disabled={!isConnected}
            aria-label="设为归位"
          >
            设为归位
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
