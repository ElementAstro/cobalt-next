import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Template } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface TemplateManagerProps {
  currentSettings: Template;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateManager({
  currentSettings,
  onSelectTemplate,
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");

  useEffect(() => {
    const savedTemplates = localStorage.getItem("customTemplates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplate = () => {
    try {
      if (!newTemplateName.trim()) {
        toast({
          title: "错误",
          description: "模板名称不能为空",
          variant: "destructive",
        });
        return;
      }

      if (templates.some((t) => t.name === newTemplateName)) {
        toast({
          title: "错误",
          description: "模板名称已存在",
          variant: "destructive",
        });
        return;
      }

      const newTemplate = { ...currentSettings, name: newTemplateName.trim() };
      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));
      setNewTemplateName("");
      toast({
        title: "成功",
        description: "模板保存成功",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "保存模板失败",
        variant: "destructive",
      });
    }
  };

  const deleteTemplate = (templateName: string) => {
    const updatedTemplates = templates.filter((t) => t.name !== templateName);
    setTemplates(updatedTemplates);
    localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold">模板管理</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="新模板名称"
        />
        <Button onClick={saveTemplate}>保存当前设置为模板</Button>
      </div>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {templates.map((template) => (
            <motion.div
              key={template.name}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative p-4 border border-gray-700 rounded-lg bg-gray-800/50"
            >
              <span>{template.name}</span>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTemplate(template)}
                >
                  使用
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTemplate(template.name)}
                >
                  删除
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
