import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TodoSortProps {
  sort: "priority" | "dueDate" | "celestialObject";
  setSort: React.Dispatch<React.SetStateAction<"priority" | "dueDate" | "celestialObject">>;
}

export function TodoSort({ sort, setSort }: TodoSortProps) {
  return (
    <Select
      value={sort}
      onValueChange={(value: "priority" | "dueDate" | "celestialObject") => setSort(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="priority">优先级</SelectItem>
        <SelectItem value="dueDate">截止日期</SelectItem>
        <SelectItem value="celestialObject">天体名称</SelectItem> {/* 新增排序选项 */}
      </SelectContent>
    </Select>
  );
}
