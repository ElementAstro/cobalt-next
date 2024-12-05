"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const BUILT_IN_TEMPLATES = [
  {
    name: "GET Request",
    config: {
      method: "GET",
      url: "https://api.example.com/users",
      headers: {},
    },
  },
  {
    name: "POST JSON",
    config: {
      method: "POST",
      url: "https://api.example.com/users",
      headers: { "Content-Type": "application/json" },
      data: { name: "John Doe", email: "john@example.com" },
    },
  },
  {
    name: "PUT with Authentication",
    config: {
      method: "PUT",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE",
      },
      data: { name: "Jane Doe", email: "jane@example.com" },
    },
  },
  {
    name: "DELETE Request",
    config: {
      method: "DELETE",
      url: "https://api.example.com/users/1",
      headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
    },
  },
];

export default function TemplateManager() {
  const [templates, setTemplates] = useState(BUILT_IN_TEMPLATES);
  const [name, setName] = useState("");
  const [config, setConfig] = useState("");

  useEffect(() => {
    const savedTemplates = JSON.parse(
      localStorage.getItem("customTemplates") || "[]"
    );
    setTemplates([...BUILT_IN_TEMPLATES, ...savedTemplates]);
  }, []);

  const handleSave = () => {
    if (name && config) {
      try {
        const parsedConfig = JSON.parse(config);
        const newTemplate = { name, config: parsedConfig };
        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        localStorage.setItem(
          "customTemplates",
          JSON.stringify(
            updatedTemplates.filter(
              (t) => !BUILT_IN_TEMPLATES.some((bt) => bt.name === t.name)
            )
          )
        );
        setName("");
        setConfig("");
      } catch (error) {
        alert("Invalid JSON configuration");
      }
    }
  };

  const handleRemove = (templateToRemove: { name: string }) => {
    const updatedTemplates = templates.filter(
      (t) => t.name !== templateToRemove.name
    );
    setTemplates(updatedTemplates);
    localStorage.setItem(
      "customTemplates",
      JSON.stringify(
        updatedTemplates.filter(
          (t) => !BUILT_IN_TEMPLATES.some((bt) => bt.name === t.name)
        )
      )
    );
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
          <CardTitle>Request Templates</CardTitle>
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
                placeholder="Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <Textarea
                placeholder="Request Configuration (JSON)"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                rows={4}
                className="w-full"
              />
              <Button onClick={handleSave} className="w-full">
                Save Template
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
                      onClick={() => handleRemove(template)}
                    >
                      Remove
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
