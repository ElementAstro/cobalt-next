"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { TodoFilter } from "./TodoFilter";
import { TodoStats } from "./TodoStats";
import { TodoSort } from "./TodoSort";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: "personal" | "work" | "study" | "astronomy";
  priority: "high" | "medium" | "low";
  dueDate: string;
  observationLocation?: string;
  weatherConditions?: string;
  moonPhase?: string;
  celestialObjectRiseTime?: string;
  celestialObjectSetTime?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState({
    category: "all",
    priority: "all",
    completed: "all",
  });
  const [sort, setSort] = useState<"priority" | "dueDate">("priority");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, "id" | "completed">) => {
    setTodos([...todos, { ...todo, id: Date.now(), completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos
    .filter(
      (todo) =>
        (filter.category === "all" || todo.category === filter.category) &&
        (filter.priority === "all" || todo.priority === filter.priority) &&
        (filter.completed === "all" ||
          (filter.completed === "completed" && todo.completed) ||
          (filter.completed === "active" && !todo.completed)) &&
        todo.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background text-foreground py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-card shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Astronomy TODO List</h1>
              <ThemeToggle />
            </div>
            <AddTodoForm onAdd={addTodo} />
            <div className="mt-6 space-y-4">
              <Input
                type="text"
                placeholder="Search todos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <TodoFilter filter={filter} setFilter={setFilter} />
              <TodoSort sort={sort} setSort={setSort} />
            </div>
            <TodoStats todos={filteredTodos} />
            <ul className="space-y-3 mt-6">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
