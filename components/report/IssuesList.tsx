"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Issue = {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature";
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";
};

type IssuesListProps = {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
};

export function IssuesList({ issues, onSelectIssue }: IssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5;

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === "all" || issue.type === typeFilter) &&
      (statusFilter === "all" || issue.status === statusFilter) &&
      (priorityFilter === "all" || issue.priority === priorityFilter)
  );

  const pageCount = Math.ceil(filteredIssues.length / issuesPerPage);
  const currentIssues = filteredIssues.slice(
    (currentPage - 1) * issuesPerPage,
    currentPage * issuesPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 p-4 bg-gray-900 text-white min-h-screen"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="搜索问题..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="all">所有类型</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">功能</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="all">所有状态</SelectItem>
            <SelectItem value="open">开放</SelectItem>
            <SelectItem value="in-progress">进行中</SelectItem>
            <SelectItem value="closed">已关闭</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="bg-gray-800 text-white">
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="all">所有优先级</SelectItem>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence>
        {currentIssues.map((issue) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="mb-4 cursor-pointer hover:shadow-md transition-shadow bg-gray-800 text-white"
              onClick={() => onSelectIssue(issue)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                  <div className="space-x-2">
                    <Badge
                      variant={issue.type === "bug" ? "destructive" : "default"}
                    >
                      {issue.type === "bug" ? "Bug" : "功能"}
                    </Badge>
                    <Badge
                      variant={
                        issue.priority === "high"
                          ? "destructive"
                          : issue.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {issue.priority}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  状态:{" "}
                  {issue.status === "open"
                    ? "开放"
                    : issue.status === "in-progress"
                    ? "进行中"
                    : "已关闭"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{issue.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-800 text-white"
        >
          上一页
        </Button>
        <span>
          第 {currentPage} 页，共 {pageCount} 页
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
          className="bg-gray-800 text-white"
        >
          下一页
        </Button>
      </div>
    </motion.div>
  );
}
