"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "@/components/todolist/TodoItem";
import { AddTodoForm } from "@/components/todolist/AddTodoForm";
import { TodoFilter } from "@/components/todolist/TodoFilter";
import { TodoStats } from "@/components/todolist/TodoStats";
import { TodoSort } from "@/components/todolist/TodoSort";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  celestialObject?: string; // 新增字段
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState({
    category: "all",
    priority: "all",
    completed: "all",
    dueDateStart: "",
    dueDateEnd: "",
    celestialObject: "all", // 新增过滤条件
  });
  const [sort, setSort] = useState<"priority" | "dueDate" | "celestialObject">(
    "priority"
  );
  const [search, setSearch] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [isBatchActions, setIsBatchActions] = useState(false);

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

  const toggleSelectTodo = (id: number) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const deleteSelectedTodos = () => {
    setTodos(todos.filter((todo) => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
    setIsBatchActions(false);
  };

  const toggleSelectedTodos = () => {
    setTodos(
      todos.map((todo) =>
        selectedTodos.includes(todo.id) ? { ...todo, completed: true } : todo
      )
    );
    setSelectedTodos([]);
    setIsBatchActions(false);
  };

  const filteredTodos = todos
    .filter(
      (todo) =>
        (filter.category === "all" || todo.category === filter.category) &&
        (filter.priority === "all" || todo.priority === filter.priority) &&
        (filter.completed === "all" ||
          (filter.completed === "completed" && todo.completed) ||
          (filter.completed === "active" && !todo.completed)) &&
        (filter.celestialObject === "all" ||
          todo.celestialObject === filter.celestialObject) && // 新增过滤逻辑
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center">
      <motion.div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AddTodoForm onAdd={addTodo} />
        <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="搜索待办事项..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 dark:bg-gray-700 dark:text-gray-200"
          />
          <TodoFilter filter={filter} setFilter={setFilter} />
          <TodoSort sort={sort} setSort={setSort} />
        </div>
        {selectedTodos.length > 0 && (
          <motion.div
            className="mt-4 flex space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={deleteSelectedTodos} variant="destructive">
              删除选中
            </Button>
            <Button onClick={toggleSelectedTodos} variant="secondary">
              标记完成
            </Button>
            <Button onClick={() => setIsBatchActions(false)} variant="ghost">
              取消
            </Button>
          </motion.div>
        )}
        <TodoStats todos={filteredTodos} />
        <ul className="mt-6 space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </AnimatePresence>
        </ul>
        {filteredTodos.length === 0 && (
          <motion.p
            className="mt-4 text-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            没有符合条件的待办事项。
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
