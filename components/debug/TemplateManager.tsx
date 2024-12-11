"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useRequestStore } from "@/lib/store/debug";

const BUILT_IN_TEMPLATES = [
  {
    name: "GET Request",
    config: {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {},
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      rejectUnauthorized: true,
    },
  },
  // 其他内置模板...
];

export default function TemplateManager() {
  const { templates, addTemplate, deleteTemplate } = useRequestStore();
  const [name, setName] = useState("");
  const [config, setConfig] = useState("");

  useEffect(() => {
    // 初始化模板
  }, []);

  const handleSave = () => {
    if (name && config) {
      try {
        const parsedConfig = JSON.parse(config);
        const newTemplate = { name, config: parsedConfig };
        addTemplate(newTemplate);
        setName("");
        setConfig("");
      } catch {
        alert("无效的 JSON 配置");
      }
    }
  };

  const handleRemove = (templateName: string) => {
    deleteTemplate(templateName);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>请求模板管理</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-2 mb-4">
              <Input
                placeholder="模板名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <Textarea
                placeholder='请求配置 (JSON 格式，例如: {"method": "GET", "url": "https://api.example.com"} )'
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                rows={4}
                className="w-full"
              />
              <Button onClick={handleSave} className="w-full">
                保存模板
              </Button>
            </div>
            <ul className="space-y-2">
              {templates.map((template, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-between items-center bg-gray-800 p-2 rounded"
                >
                  <span>{template.name}</span>
                  {!BUILT_IN_TEMPLATES.some(
                    (bt) => bt.name === template.name
                  ) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(template.name)}
                    >
                      移除
                    </Button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
