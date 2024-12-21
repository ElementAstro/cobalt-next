import { create } from "zustand";
import { LogEntry } from "@/types/log";

// 定义日志状态接口
interface LogState {
  logs: LogEntry[]; // 所有日志条目
  filteredLogs: LogEntry[]; // 过滤后的日志条目
  logLevel: string; // 日志级别
  filter: string; // 过滤条件
  search: string; // 搜索关键字
  isCollapsed: boolean; // 是否折叠
  logCount: number; // 日志条目总数
  isPaginationEnabled: boolean; // 是否启用分页
  currentPage: number; // 当前页码
  selectedLogs: number[]; // 选中的日志条目ID
  activeTab: string; // 当前活动的标签页
  selectedLogForNote: LogEntry | null; // 选中的用于添加备注的日志条目
  newNote: string; // 新备注内容
  newTag: string; // 新标签内容
  isRealTimeEnabled: boolean; // 是否启用实时模式
  exportFormat: "json" | "csv"; // 导出格式
  comparisonTimeRange: "1h" | "24h" | "7d"; // 比较时间范围
  isMockMode: boolean; // 是否启用模拟模式
  theme: "light" | "dark"; // 主题模式
  setLogs: (logs: LogEntry[]) => void; // 设置日志条目
  setFilteredLogs: (logs: LogEntry[]) => void; // 设置过滤后的日志条目
  setLogLevel: (level: string) => void; // 设置日志级别
  setFilter: (filter: string) => void; // 设置过滤条件
  setSearch: (search: string) => void; // 设置搜索关键字
  setIsCollapsed: (collapsed: boolean) => void; // 设置是否折叠
  setLogCount: (count: number) => void; // 设置日志条目总数
  setIsPaginationEnabled: (enabled: boolean) => void; // 设置是否启用分页
  setCurrentPage: (page: number) => void; // 设置当前页码
  setSelectedLogs: (ids: number[]) => void; // 设置选中的日志条目ID
  setActiveTab: (tab: string) => void; // 设置当前活动的标签页
  setSelectedLogForNote: (log: LogEntry | null) => void; // 设置选中的用于添加备注的日志条目
  setNewNote: (note: string) => void; // 设置新备注内容
  setNewTag: (tag: string) => void; // 设置新标签内容
  setIsRealTimeEnabled: (enabled: boolean) => void; // 设置是否启用实时模式
  setExportFormat: (format: "json" | "csv") => void; // 设置导出格式
  setComparisonTimeRange: (range: "1h" | "24h" | "7d") => void; // 设置比较时间范围
  setIsMockMode: (mode: boolean) => void; // 设置是否启用模拟模式
  refreshLogs: () => void; // 刷新日志条目
}

// 创建日志状态存储
export const useLogStore = create<LogState>((set) => ({
  logs: [], // 初始化日志条目为空
  filteredLogs: [], // 初始化过滤后的日志条目为空
  logLevel: "all", // 初始化日志级别为"all"
  filter: "", // 初始化过滤条件为空
  search: "", // 初始化搜索关键字为空
  isCollapsed: false, // 初始化为未折叠状态
  logCount: 1000, // 初始化日志条目总数为1000
  isPaginationEnabled: false, // 初始化为未启用分页
  currentPage: 1, // 初始化当前页码为1
  selectedLogs: [], // 初始化选中的日志条目ID为空
  activeTab: "logs", // 初始化当前活动的标签页为"logs"
  selectedLogForNote: null, // 初始化选中的用于添加备注的日志条目为空
  newNote: "", // 初始化新备注内容为空
  newTag: "", // 初始化新标签内容为空
  isRealTimeEnabled: true, // 初始化为启用实时模式
  exportFormat: "json", // 初始化导出格式为"json"
  comparisonTimeRange: "24h", // 初始化比较时间范围为"24h"
  isMockMode: false, // 初始化为未启用模拟模式
  theme: "dark", // 初始化主题模式为"dark"
  setLogs: (logs) => set({ logs }), // 设置日志条目
  setFilteredLogs: (filteredLogs) => set({ filteredLogs }), // 设置过滤后的日志条目
  setLogLevel: (logLevel) => set({ logLevel }), // 设置日志级别
  setFilter: (filter) => set({ filter }), // 设置过滤条件
  setSearch: (search) => set({ search }), // 设置搜索关键字
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }), // 设置是否折叠
  setLogCount: (logCount) => set({ logCount }), // 设置日志条目总数
  setIsPaginationEnabled: (isPaginationEnabled) => set({ isPaginationEnabled }), // 设置是否启用分页
  setCurrentPage: (currentPage) => set({ currentPage }), // 设置当前页码
  setSelectedLogs: (selectedLogs) => set({ selectedLogs }), // 设置选中的日志条目ID
  setActiveTab: (activeTab) => set({ activeTab }), // 设置当前活动的标签页
  setSelectedLogForNote: (selectedLogForNote) => set({ selectedLogForNote }), // 设置选中的用于添加备注的日志条目
  setNewNote: (newNote) => set({ newNote }), // 设置新备注内容
  setNewTag: (newTag) => set({ newTag }), // 设置新标签内容
  setIsRealTimeEnabled: (isRealTimeEnabled) => set({ isRealTimeEnabled }), // 设置是否启用实时模式
  setExportFormat: (exportFormat) => set({ exportFormat }), // 设置导出格式
  setComparisonTimeRange: (comparisonTimeRange) => set({ comparisonTimeRange }), // 设置比较时间范围
  setIsMockMode: (isMockMode) => set({ isMockMode }), // 设置是否启用模拟模式
  refreshLogs: () => {
    const state = useLogStore.getState();
    const filteredLogs = state.logs.filter((log) => {
      // 级别过滤
      if (state.logLevel !== "all" && log.level !== state.logLevel) {
        return false;
      }

      // 搜索过滤
      if (
        state.search &&
        !log.message.toLowerCase().includes(state.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    set({ filteredLogs });
  },
}));
