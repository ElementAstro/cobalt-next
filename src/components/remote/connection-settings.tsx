"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface ConnectionSettingsProps {
  host: string;
  port: string;
  password: string;
  isConnected: boolean;
  setHost: (value: string) => void;
  setPort: (value: string) => void;
  setPassword: (value: string) => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  host,
  port,
  password,
  isConnected,
  setHost,
  setPort,
  setPassword,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <Input
        type="text"
        placeholder="VNC 主机"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        disabled={isConnected}
      />
      <Input
        type="text"
        placeholder="VNC 端口"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        disabled={isConnected}
      />
      <Input
        type="password"
        placeholder="密码 (可选)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isConnected}
      />
    </div>
  );
};

export default ConnectionSettings;
