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
    <div className="flex flex-wrap justify-between text-sm text-muted-foreground mt-4">
      <span>总计: {totalTodos}</span>
      <span>进行中: {activeTodos}</span>
      <span>已完成: {completedTodos}</span>
      <span>包含天体: {celestialObjectTodos}</span> {/* 新增统计信息 */}
    </div>
  );
}
