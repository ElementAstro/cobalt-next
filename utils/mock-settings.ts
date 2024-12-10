import { DiskInfo } from "@/types/settings";

const initialDisks: DiskInfo[] = [
  {
    id: "1",
    name: "Windows",
    letter: "C",
    total: 250,
    used: 205,
    isSystem: true,
    health: "good",
    lastChecked: "2023-06-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Data",
    letter: "D",
    total: 701,
    used: 559,
    health: "fair",
    lastChecked: "2023-06-01T10:00:00Z",
  },
  {
    id: "3",
    name: "Newsmy",
    letter: "E",
    total: 465,
    used: 37.2,
    health: "good",
    lastChecked: "2023-06-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Newsmy",
    letter: "F",
    total: 465,
    used: 0.172,
    health: "poor",
    lastChecked: "2023-06-01T10:00:00Z",
  },
];

export const mockDiskService = {
  getDisks: (): Promise<DiskInfo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          initialDisks.map((disk) => ({
            ...disk,
            used: Math.min(disk.total, disk.used + Math.random() * 10 - 5),
            lastChecked: new Date().toISOString(),
          }))
        );
      }, 500);
    });
  },
  getDiskCleanupSuggestions: (diskId: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "清理临时文件",
          "卸载不常用的应用",
          "删除重复文件",
          "清空回收站",
        ]);
      }, 300);
    });
  },
  exportDiskReport: (disks: DiskInfo[]): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = disks
          .map(
            (disk) =>
              `磁盘 ${disk.letter}: ${disk.name}
          总容量: ${disk.total} GB
          已使用: ${disk.used} GB
          健康状况: ${disk.health}
          最后检查时间: ${disk.lastChecked}
          `
          )
          .join("\n\n");
        resolve(report);
      }, 500);
    });
  },
};
