import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TodoFilterProps {
  filter: {
    category: string;
    priority: string;
    completed: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      category: string;
      priority: string;
      completed: string;
    }>
  >;
}

export function TodoFilter({ filter, setFilter }: TodoFilterProps) {
  return (
    <div className="flex space-x-2">
      <Select
        value={filter.category}
        onValueChange={(value) => setFilter({ ...filter, category: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
          <SelectItem value="work">Work</SelectItem>
          <SelectItem value="study">Study</SelectItem>
          <SelectItem value="astronomy">Astronomy</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.priority}
        onValueChange={(value) => setFilter({ ...filter, priority: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filter.completed}
        onValueChange={(value) => setFilter({ ...filter, completed: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
