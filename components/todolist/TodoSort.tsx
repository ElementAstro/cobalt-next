import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TodoSortProps {
  sort: "priority" | "dueDate" | "celestialObject" | "category" | "created" | "modified";
  setSort: React.Dispatch<React.SetStateAction<"priority" | "dueDate" | "celestialObject" | "category" | "created" | "modified">>;
}

export function TodoSort({ sort, setSort }: TodoSortProps) {
  return (
    <div className="w-full md:w-48">
      <Select
        value={sort}
        onValueChange={(value: TodoSortProps['sort']) => setSort(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="priority">按优先级</SelectItem>
          <SelectItem value="dueDate">按截止日期</SelectItem>
          <SelectItem value="celestialObject">按天体名称</SelectItem>
          <SelectItem value="category">按类别</SelectItem>
          <SelectItem value="created">按创建时间</SelectItem>
          <SelectItem value="modified">按修改时间</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
