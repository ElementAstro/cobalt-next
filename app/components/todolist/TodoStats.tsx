import { Todo } from ".";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const astronomyTodos = todos.filter(
    (todo) => todo.category === "astronomy"
  ).length;

  return (
    <div className="flex flex-wrap justify-between text-sm text-muted-foreground mt-4">
      <span>Total: {totalTodos}</span>
      <span>Active: {activeTodos}</span>
      <span>Completed: {completedTodos}</span>
      <span>Astronomy: {astronomyTodos}</span>
    </div>
  );
}
