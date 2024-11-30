import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogFilterProps {
  onFilter: (level: string) => void;
}

export function LogFilter({ onFilter }: LogFilterProps) {
  return (
    <Select onValueChange={onFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择日志级别" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全部</SelectItem>
        <SelectItem value="info">信息</SelectItem>
        <SelectItem value="warning">警告</SelectItem>
        <SelectItem value="error">错误</SelectItem>
      </SelectContent>
    </Select>
  );
}
