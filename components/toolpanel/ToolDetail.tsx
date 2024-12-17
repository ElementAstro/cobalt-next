import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { ToolDetailProps } from "@/types/toolpanel";
import { motion } from "framer-motion";

export function ToolDetail({
  id,
  name,
  icon: Icon,
  onBack,
  onUse,
  CustomComponent,
}: ToolDetailProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  const [fullscreen, setFullscreen] = useState(false);

  const handleUse = async () => {
    if (!input.trim()) {
      setError("输入不能为空");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(interval);
      setProgress(100);

      setOutput(`处理结果: ${input}`);
      setError("");
      onUse(id);
    } catch (err) {
      setError("处理失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <motion.div
      className="space-y-4 p-4 flex flex-col h-full overflow-hidden dark:bg-gray-800/95 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <Icon className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.div>

      {CustomComponent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-auto max-h-[450px] dark:bg-gray-900 rounded-lg p-4"
        >
          <CustomComponent />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="space-y-2">
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
            {isLoading && <Progress value={progress} className="w-full h-2" />}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleUse}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "处理中" : "处理"}
            </Button>
            <Button onClick={handleReset} variant="secondary">
              重置
            </Button>
          </div>

          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <label htmlFor="output" className="text-sm font-medium">
                输出:
              </label>
              <Textarea id="output" value={output} readOnly />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
