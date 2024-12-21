import log from "loglevel";
import { useLogStore } from "@/lib/store/log";
import { LogEntry } from "@/types/log";

log.setLevel("info");

// 创建自定义处理器
const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return function (this: void, message) {
    const logEntry: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      level: methodName as "info" | "warn" | "error",
      message: String(message),
      source: "client",
    };

    // 同步到 store
    const store = useLogStore.getState();
    store.setLogs([...store.logs, logEntry]);

    // 如果启用了实时模式，也更新过滤后的日志
    if (store.isRealTimeEnabled) {
      store.setFilteredLogs([...store.filteredLogs, logEntry]);
    }

    // 调用原始日志方法
    rawMethod.call(this, message);
  };
};

export default log;
