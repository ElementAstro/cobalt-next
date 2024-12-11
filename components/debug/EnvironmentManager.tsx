// components/EnvironmentManager.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEnvironmentStore } from "@/lib/store/debug";
import { Trash2, Edit2, Save, X } from "lucide-react";

export default function EnvironmentManager() {
  const {
    environment,
    addVariable,
    updateVariable,
    removeVariable,
    resetEnvironment,
  } = useEnvironmentStore();
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleAdd = () => {
    if (key.trim() && value.trim()) {
      addVariable(key.trim(), value.trim());
      setKey("");
      setValue("");
    }
  };

  const handleUpdate = (keyToUpdate: string) => {
    if (editValue.trim()) {
      updateVariable(keyToUpdate, editValue.trim());
      setEditingKey(null);
      setEditValue("");
    }
  };

  const filteredEnvironment = Object.entries(environment).filter(
    ([k, v]) =>
      k.toLowerCase().includes(search.toLowerCase()) ||
      v.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Card className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>环境变量管理器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
          <Input
            placeholder="键"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-gray-700 text-white"
          />
          <Input
            placeholder="值"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-gray-700 text-white"
          />
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            添加
          </Button>
        </div>
        <div className="mb-4">
          <Input
            placeholder="搜索变量..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-700 text-white"
          />
        </div>
        <AnimatePresence>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-2"
          >
            {filteredEnvironment.map(([k, v]) => (
              <motion.li
                key={k}
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-700 p-2 rounded"
              >
                {editingKey === k ? (
                  <div className="flex-1 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-gray-600 text-white"
                    />
                    <Button
                      onClick={() => handleUpdate(k)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      保存
                    </Button>
                    <Button
                      onClick={() => setEditingKey(null)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">
                      <strong>{k}</strong>: {v}
                    </span>
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingKey(k);
                          setEditValue(v);
                        }}
                        className="text-yellow-400 hover:text-yellow-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => removeVariable(k)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
        {Object.keys(environment).length > 0 && (
          <Button
            onClick={resetEnvironment}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            重置所有变量
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
