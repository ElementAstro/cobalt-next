import { Todo } from "../../app/dashboard/components/TodoList";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const celestialObjectTodos = todos.filter(
    (todo) => todo.celestialObject
  ).length; // 新增统计字段

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="stat-card">
        <h3 className="text-lg font-semibold">总计</h3>
        <div className="text-2xl font-bold">{totalTodos}</div>
        <div className="text-xs text-muted-foreground">所有待办事项</div>
      </div>
      <div className="stat-card">
        <h3 className="text-lg font-semibold">进行中</h3>
        <div className="text-2xl font-bold text-yellow-500">{activeTodos}</div>
        <div className="text-xs text-muted-foreground">未完成的任务</div>
      </div>
      <div className="stat-card">
        <h3 className="text-lg font-semibold">已完成</h3>
        <div className="text-2xl font-bold text-green-500">{completedTodos}</div>
        <div className="text-xs text-muted-foreground">
          完成率: {((completedTodos / totalTodos) * 100 || 0).toFixed(1)}%
        </div>
      </div>
      <div className="stat-card">
        <h3 className="text-lg font-semibold">天文观测</h3>
        <div className="text-2xl font-bold text-blue-500">{celestialObjectTodos}</div>
        <div className="text-xs text-muted-foreground">天体相关任务</div>
      </div>
    </div>
  );
}
