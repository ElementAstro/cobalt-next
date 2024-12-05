import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LucideIcon } from "lucide-react";
import { ToolDetailProps } from "@/types/toolpanel";
import { motion } from "framer-motion";

export function ToolDetail({
  id,
  name,
  icon: Icon,
  onBack,
  onUse,
  CustomComponent, // 新增的自定义组件属性
}: ToolDetailProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleUse = () => {
    if (!input.trim()) {
      setError("输入不能为空");
      return;
    }
    // 模拟工具使用
    setOutput(`处理结果: ${input}`);
    setError("");
    onUse(id);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <motion.div
      className="space-y-4 p-4 flex flex-col md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-4">
          <Button onClick={onBack} variant="outline">
            返回
          </Button>
          <Icon className="h-6 w-6" />
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        {CustomComponent ? (
          <div className="overflow-auto max-h-[450px]">
            <CustomComponent />
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <label htmlFor="input" className="text-sm font-medium">
                输入:
              </label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`请输入要处理的${name}内容...`}
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUse}>处理</Button>
              <Button onClick={handleReset} variant="secondary">
                重置
              </Button>
            </div>
            {output && (
              <div className="space-y-2">
                <label htmlFor="output" className="text-sm font-medium">
                  输出:
                </label>
                <Textarea id="output" value={output} readOnly />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
