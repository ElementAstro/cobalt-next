import React, { useState } from "react";
import {
  Wifi,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { WiFiNetwork } from "@/types/wifi";

interface NetworkItemProps {
  network: WiFiNetwork;
  onConnect: (network: WiFiNetwork, password?: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

const NetworkItem: React.FC<NetworkItemProps> = React.memo(
  ({ network, onConnect, onDisconnect, isConnected }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const handleConnect = async () => {
      if (network.isSecure && !password) {
        setShowPasswordInput(true);
        return;
      }
      setIsConnecting(true);
      try {
        await onConnect(network, password);
      } finally {
        setIsConnecting(false);
        setPassword("");
        setShowPasswordInput(false);
      }
    };

    return (
      <motion.div
        className="p-4 rounded-lg bg-card dark:bg-card-dark shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Wifi className="mr-2 text-primary" />
            <span className="font-medium text-lg">{network.name}</span>
          </div>
          <div className="flex items-center">
            {network.isSecure && <Lock className="w-4 h-4 mr-2 text-secure" />}
            <div className="w-6 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${network.signalStrength}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>{network.frequency}</span>
        </div>
        {isConnected ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-500">已连接</span>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              断开连接
            </Button>
          </div>
        ) : (
          <>
            {showPasswordInput && network.isSecure && (
              <div className="flex mb-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="输入WiFi密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mr-2"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            <Button
              className="w-full mt-2 flex items-center justify-center"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isConnecting ? "连接中..." : "连接"}
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          className="w-full mt-2 flex items-center justify-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <ChevronUp className="mr-2" />
          ) : (
            <ChevronDown className="mr-2" />
          )}
          {showDetails ? "隐藏详情" : "显示详情"}
        </Button>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="mt-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>信号强度: {network.signalStrength}%</p>
              <p>频段: {network.frequency}</p>
              <p>安全性: {network.isSecure ? "加密" : "开放"}</p>
              {network.lastConnected && (
                <p>
                  上次连接: {new Date(network.lastConnected).toLocaleString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default NetworkItem;
