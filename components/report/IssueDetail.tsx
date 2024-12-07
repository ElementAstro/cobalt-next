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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type Issue = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature";
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
};

type IssueDetailProps = {
  issue: Issue;
  onUpdate: (updatedIssue: Issue) => void;
  onDelete: (id: number) => void;
};

export function IssueDetail({ issue, onUpdate, onDelete }: IssueDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssue, setEditedIssue] = useState(issue);

  const handleUpdate = () => {
    onUpdate(editedIssue);
    setIsEditing(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isEditing ? (
        <motion.div
          key="edit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle>编辑问题</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={editedIssue.title}
                    onChange={(e) =>
                      setEditedIssue({ ...editedIssue, title: e.target.value })
                    }
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={editedIssue.description}
                    onChange={(e) =>
                      setEditedIssue({
                        ...editedIssue,
                        description: e.target.value,
                      })
                    }
                    className="bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="type">类型</Label>
                  <Select
                    value={editedIssue.type}
                    onValueChange={(value) =>
                      setEditedIssue({
                        ...editedIssue,
                        type: value as "bug" | "feature",
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">功能</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">状态</Label>
                  <Select
                    value={editedIssue.status}
                    onValueChange={(value) =>
                      setEditedIssue({
                        ...editedIssue,
                        status: value as "open" | "in-progress" | "closed",
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="open">开放</SelectItem>
                      <SelectItem value="in-progress">进行中</SelectItem>
                      <SelectItem value="closed">已关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">优先级</Label>
                  <Select
                    value={editedIssue.priority}
                    onValueChange={(value) =>
                      setEditedIssue({
                        ...editedIssue,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleUpdate}
                    className="bg-primary text-white"
                  >
                    保存
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-700 text-white"
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{issue.description}</p>
              <p>类型: {issue.type === "bug" ? "Bug" : "功能"}</p>
              <p>
                状态:{" "}
                {issue.status === "open"
                  ? "开放"
                  : issue.status === "in-progress"
                  ? "进行中"
                  : "已关闭"}
              </p>
              <p>优先级: {issue.priority}</p>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white"
                >
                  编辑
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(issue.id)}
                  className="bg-red-600 text-white"
                >
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
