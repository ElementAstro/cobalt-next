"use client";

import React from "react";
import { Wifi, WifiOff, Download, Upload, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Span } from "@/components/custom/span";

interface NetworkStatusProps {
  status: {
    online: boolean;
    downlink?: number;
    uplink?: number;
    rtt?: number;
  };
}

export function NetworkStatus({ status }: NetworkStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 p-2 rounded-lg bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status.online ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <Span variant={status.online ? "success" : "error"}>
            {status.online ? "网络正常" : "网络异常"}
          </Span>
        </div>
        {status.online && (
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Span icon={Download} tooltip="下载速度">
              速度: {status.downlink || 0} Mbps
            </Span>
            <Span icon={Upload} tooltip="上传速度">
              上传: {status.uplink || 0} Mbps
            </Span>
            <Span icon={Clock} tooltip="延迟">
              延迟: {status.rtt || 0} ms
            </Span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
