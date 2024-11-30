import { MoreVertical, Info } from "lucide-react";
import { Software } from "@/types/software";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SoftwareListProps {
  software: Software[];
  view: "list" | "grid" | "detail";
  onViewDetail: (software: Software) => void;
}

export function SoftwareList({
  software,
  view,
  onViewDetail,
}: SoftwareListProps) {
  const getViewClass = () => {
    switch (view) {
      case "grid":
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "detail":
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-1 gap-2";
    }
  };

  return (
    <div className={getViewClass()}>
      {software.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent"
        >
          <img
            src={item.icon}
            alt={item.name}
            className="h-12 w-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{item.name}</h3>
            <div className="flex flex-col text-sm text-muted-foreground">
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
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <span>{item.date}</span>
              <span className="w-24 text-right">{item.size}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewDetail(item)}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">查看详情</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>安装</DropdownMenuItem>
                <DropdownMenuItem>卸载</DropdownMenuItem>
                <DropdownMenuItem>更新</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
