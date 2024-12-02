"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { helpTopics } from "@/utils/mock-help";
import Link from "next/link";
import { ChevronLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function HelpTopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(
    null
  );

  const topic = helpTopics.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const relatedTopics = helpTopics
    .filter(
      (t) => t.id !== topicId && t.tags.some((tag) => topic.tags.includes(tag))
    )
    .slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <Link href="/help">
        <Button variant="outline" className="mb-4 flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" /> 返回帮助中心
        </Button>
      </Link>
      <motion.div
        variants={itemVariants}
        className="w-full max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl dark:text-white">
              {topic.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {topic.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="dark:bg-gray-700 dark:text-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[50vh] md:h-[60vh]">
              <div className="prose dark:prose-invert max-w-none">
                {topic.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <motion.div variants={itemVariants} className="w-full">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                这篇文章有帮助吗？
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={feedback === "helpful" ? "default" : "outline"}
                  onClick={() => setFeedback("helpful")}
                  className={`flex items-center ${
                    feedback === "helpful"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> 有帮助
                </Button>
                <Button
                  variant={feedback === "not-helpful" ? "default" : "outline"}
                  onClick={() => setFeedback("not-helpful")}
                  className={`flex items-center ${
                    feedback === "not-helpful"
                      ? "bg-red-500 text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> 没帮助
                </Button>
              </div>
            </motion.div>
            {feedback && (
              <motion.p
                variants={itemVariants}
                className="text-sm text-muted-foreground dark:text-gray-400"
              >
                感谢您的反馈！我们会继续改进我们的帮助内容。
              </motion.p>
            )}
            <Separator className="w-full my-4" />
            <motion.div variants={itemVariants} className="w-full">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                相关文章
              </h3>
              <ul className="space-y-2">
                {relatedTopics.map((relatedTopic) => (
                  <motion.li
                    key={relatedTopic.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="transition-transform"
                  >
                    <Link
                      href={`/help/${relatedTopic.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {relatedTopic.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
