"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useIssueStore } from "@/lib/store/report";
import { motion, AnimatePresence } from "framer-motion";

type CommentSectionProps = {
  issueId: number;
};

export function CommentSection({ issueId }: CommentSectionProps) {
  const { comments, addComment } = useIssueStore();
  const [newComment, setNewComment] = useState("");

  const issueComments = comments.filter(
    (comment) => comment.issueId === issueId
  );

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment({
        issueId,
        content: newComment,
        author: "当前用户", // 这里应该使用实际的用户名
      });
      setNewComment("");
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">评论</h3>
      <AnimatePresence>
        {issueComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 bg-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {comment.author}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="添加评论..."
          className="flex-1 bg-gray-800 text-white border-gray-700"
        />
        <Button onClick={handleAddComment} className="bg-primary text-white">
          发送
        </Button>
      </div>
    </div>
  );
}
