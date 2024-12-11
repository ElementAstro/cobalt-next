import { MoreVertical, Info } from "lucide-react";
import { Software } from "@/types/software";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store/software";

interface SoftwareListProps {
  software: Software[];
  view: "list" | "grid" | "detail";
  onViewDetail: (software: Software) => void;
}

export function SoftwareList({ onViewDetail }: SoftwareListProps) {
  const software = useStore((state) => state.software);
  const view = useStore((state) => state.view);

  const getViewClass = () => {
    switch (view) {
      case "grid":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "detail":
        return "grid grid-cols-1 gap-4";
      default:
        return "flex flex-col space-y-2";
    }
  };

  return (
    <motion.div
      className={`${getViewClass()} dark:bg-gray-800 p-4 rounded-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {software.map((item) => (
        <motion.div
          key={item.id}
          className={`flex items-center gap-4 rounded-lg border p-4 hover:bg-accent dark:bg-gray-700 transition-transform transform hover:scale-105 ${
            view !== "list" ? "flex-col items-start" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={item.icon}
            alt={item.name}
            className="h-12 w-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-white">{item.name}</h3>
            <div className="flex flex-col text-sm text-gray-400">
              <span>{item.version}</span>
              <span>{item.author}</span>
              {view !== "list" && (
                <>
                  <span>{item.date}</span>
                  <span>{item.size}</span>
                </>
              )}
            </div>
          </div>
          {view === "list" && (
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
              <span>{item.date}</span>
              <span className="w-24 text-right">{item.size}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewDetail(item)}
              className="dark:bg-gray-700 dark:text-white"
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">查看详情</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dark:bg-gray-700 dark:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-gray-700 dark:text-white"
              >
                <DropdownMenuItem>安装</DropdownMenuItem>
                <DropdownMenuItem>卸载</DropdownMenuItem>
                <DropdownMenuItem>更新</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
