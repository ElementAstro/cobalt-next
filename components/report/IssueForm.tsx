"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TagInput } from "../custom/TagInput";
import ReactMarkdown from "react-markdown";
import { Issue } from "@/lib/store/report";

type IssueTemplate = {
  title: string;
  description: string;
  type: "bug" | "feature";
  priority: "low" | "medium" | "high";
};

const issueTemplates: Record<string, IssueTemplate> = {
  bugReport: {
    title: "Bug: ",
    description:
      "## 步骤复现:\n1.\n2.\n3.\n\n## 预期结果:\n\n## 实际结果:\n\n## 其他信息:",
    type: "bug",
    priority: "medium",
  },
  featureRequest: {
    title: "功能请求: ",
    description: "## 功能描述:\n\n## 为什么需要这个功能:\n\n## 可能的实现方式:",
    type: "feature",
    priority: "low",
  },
};

type IssueFormProps = {
  onSubmit: (issue: Omit<Issue, "id" | "status">) => void;
};

export function IssueForm({ onSubmit }: IssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"bug" | "feature">("bug");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, type, priority, tags });
    setTitle("");
    setDescription("");
    setType("bug");
    setPriority("medium");
    setTags([]);
  };

  const applyTemplate = (template: IssueTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    setPriority(template.priority);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-900 text-white rounded-lg shadow-md"
    >
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>提交新的反馈</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="template">选择模板</Label>
              <Select
                onValueChange={(value) => applyTemplate(issueTemplates[value])}
              >
                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  <SelectItem value="bugReport">Bug报告</SelectItem>
                  <SelectItem value="featureRequest">功能请求</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="简要描述问题或功能请求"
                required
                className="bg-gray-700 text-white border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="description">描述</Label>
              <div className="flex justify-end mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="border-gray-600 text-white"
                >
                  {previewMode ? "编辑" : "预览"}
                </Button>
              </div>
              {previewMode ? (
                <div className="border rounded-md p-2 min-h-[200px] overflow-auto bg-gray-700 text-white">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              ) : (
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请详细描述问题或功能请求"
                  required
                  rows={6}
                  className="bg-gray-700 text-white border-gray-600"
                />
              )}
            </div>
            <div>
              <Label htmlFor="type">类型</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as "bug" | "feature")}
              >
                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">功能请求</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white">
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">标签</Label>
              <TagInput
                tags={tags}
                onExceedMaxTags={() => alert("标签数量已达到上限")}
                maxTags={10}
                minLength={2}
                maxLength={15}
                placeholder="添加标签..."
                customBadgeStyles={{ backgroundColor: "#4A5568" }}
                customInputStyles={{ backgroundColor: "#2D3748" }}
              />
            </div>
            <Button type="submit" className="bg-primary text-white">
              提交
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
