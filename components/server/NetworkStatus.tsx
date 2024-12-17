import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkStatusProps {
  status: {
    online: boolean;
    downlink?: number;
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
          <span className="text-sm font-medium">
            {status.online ? '网络正常' : '网络异常'}
          </span>
        </div>
        {status.online && (
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <span>速度: {status.downlink || 0} Mbps</span>
            <span>延迟: {status.rtt || 0} ms</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
