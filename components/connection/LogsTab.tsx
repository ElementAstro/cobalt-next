// components/LogsTab.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useLogsStore } from "@/lib/store/connection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, AlertCircle, Info, AlertTriangle } from "lucide-react";

export function LogsTab() {
  const { logs, filter, setFilter, clearLogs } = useLogsStore();

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 p-4 rounded-lg shadow-xl mx-auto"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索日志..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            onClick={clearLogs}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            清除日志
          </Button>
        </div>

        <div className="bg-gray-800 rounded-md h-[500px] overflow-y-auto">
          <AnimatePresence>
            {filteredLogs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <div className="mr-3 mt-1">{getIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-400 text-sm font-mono">
                      {log.timestamp}
                    </span>
                    <span className="text-white">{log.message}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-center py-8"
            >
              没有找到匹配的日志记录
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
