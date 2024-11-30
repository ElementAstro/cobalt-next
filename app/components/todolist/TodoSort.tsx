import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoSortProps {
  sort: "priority" | "dueDate";
  setSort: React.Dispatch<React.SetStateAction<"priority" | "dueDate">>;
}

export function TodoSort({ sort, setSort }: TodoSortProps) {
  return (
    <Select
      value={sort}
      onValueChange={(value: "priority" | "dueDate") => setSort(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="priority">Priority</SelectItem>
        <SelectItem value="dueDate">Due Date</SelectItem>
      </SelectContent>
    </Select>
  );
}
