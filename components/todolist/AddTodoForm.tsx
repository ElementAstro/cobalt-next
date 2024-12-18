import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Todo } from "../../app/dashboard/components/TodoList";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "completed">) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Todo["category"]>("personal");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [observationLocation, setObservationLocation] = useState("");
  const [weatherConditions, setWeatherConditions] = useState("");
  const [moonPhase, setMoonPhase] = useState("");
  const [celestialObjectRiseTime, setCelestialObjectRiseTime] = useState("");
  const [celestialObjectSetTime, setCelestialObjectSetTime] = useState("");
  const [celestialObject, setCelestialObject] = useState(""); // 新增状态
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        category,
        priority,
        dueDate,
        observationLocation,
        weatherConditions,
        moonPhase,
        celestialObjectRiseTime,
        celestialObjectSetTime,
        celestialObject, // 新增字段
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setText("");
    setCategory("personal");
    setPriority("medium");
    setDueDate("");
    setObservationLocation("");
    setWeatherConditions("");
    setMoonPhase("");
    setCelestialObjectRiseTime("");
    setCelestialObjectSetTime("");
    setCelestialObject(""); // 重置新增字段
    setAttachments([]);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      layout
      className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 快速添加区域 */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="快速添加待办事项..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "收起" : "展开"}
        </Button>
      </div>

      {/* 展开的详细表单 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="添加一个新的待办事项..."
                required
                className="w-full dark:bg-gray-700 dark:text-gray-200"
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Select
                value={category}
                onValueChange={(value: Todo["category"]) => setCategory(value)}
              >
                <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">个人</SelectItem>
                  <SelectItem value="work">工作</SelectItem>
                  <SelectItem value="study">学习</SelectItem>
                  <SelectItem value="astronomy">天文学</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={priority}
                onValueChange={(value: Todo["priority"]) => setPriority(value)}
              >
                <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label
                htmlFor="dueDate"
                className="block text-sm font-medium dark:text-gray-300"
              >
                截止日期
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
              />
            </motion.div>

            <AnimatePresence>
              {category === "astronomy" && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label
                      htmlFor="observationLocation"
                      className="block text-sm font-medium dark:text-gray-300"
                    >
                      观测地点
                    </Label>
                    <Input
                      id="observationLocation"
                      value={observationLocation}
                      onChange={(e) => setObservationLocation(e.target.value)}
                      placeholder="请输入观测地点"
                      className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label
                      htmlFor="weatherConditions"
                      className="block text-sm font-medium dark:text-gray-300"
                    >
                      天气状况
                    </Label>
                    <Input
                      id="weatherConditions"
                      value={weatherConditions}
                      onChange={(e) => setWeatherConditions(e.target.value)}
                      placeholder="请输入天气状况"
                      className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label
                      htmlFor="moonPhase"
                      className="block text-sm font-medium dark:text-gray-300"
                    >
                      月相
                    </Label>
                    <Input
                      id="moonPhase"
                      value={moonPhase}
                      onChange={(e) => setMoonPhase(e.target.value)}
                      placeholder="请输入月相"
                      className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div>
                      <Label
                        htmlFor="celestialObjectRiseTime"
                        className="block text-sm font-medium dark:text-gray-300"
                      >
                        天体升起时间
                      </Label>
                      <Input
                        id="celestialObjectRiseTime"
                        type="time"
                        value={celestialObjectRiseTime}
                        onChange={(e) =>
                          setCelestialObjectRiseTime(e.target.value)
                        }
                        className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="celestialObjectSetTime"
                        className="block text-sm font-medium dark:text-gray-300"
                      >
                        天体落下时间
                      </Label>
                      <Input
                        id="celestialObjectSetTime"
                        type="time"
                        value={celestialObjectSetTime}
                        onChange={(e) =>
                          setCelestialObjectSetTime(e.target.value)
                        }
                        className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Label
                      htmlFor="celestialObject"
                      className="block text-sm font-medium dark:text-gray-300"
                    >
                      天体名称
                    </Label>
                    <Input
                      id="celestialObject"
                      value={celestialObject}
                      onChange={(e) => setCelestialObject(e.target.value)}
                      placeholder="请输入天体名称"
                      className="w-full mt-1 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 新增的附件上传功能 */}
            <div className="mt-4">
              <Label>附件</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setAttachments(files);
                }}
                className="mt-2"
              />
            </div>

            {/* 显示已选择的附件 */}
            {attachments.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium">已选择的附件:</h4>
                <ul className="list-disc list-inside">
                  {attachments.map((file, index) => (
                    <li key={index} className="text-sm">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex justify-between space-x-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="submit"
          className="w-full dark:bg-blue-600 dark:text-white"
        >
          添加待办
        </Button>
        <Button
          type="button"
          onClick={resetForm}
          variant="secondary"
          className="w-full dark:bg-gray-600 dark:text-white"
        >
          重置
        </Button>
      </motion.div>
    </motion.form>
  );
}
