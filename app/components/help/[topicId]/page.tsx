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

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/help">
        <Button variant="outline" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> 返回帮助中心
        </Button>
      </Link>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{topic.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {topic.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
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
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">这篇文章有帮助吗？</h3>
            <div className="flex gap-2">
              <Button
                variant={feedback === "helpful" ? "default" : "outline"}
                onClick={() => setFeedback("helpful")}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> 有帮助
              </Button>
              <Button
                variant={feedback === "not-helpful" ? "default" : "outline"}
                onClick={() => setFeedback("not-helpful")}
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> 没帮助
              </Button>
            </div>
          </div>
          {feedback && (
            <p className="text-sm text-muted-foreground">
              感谢您的反馈！我们会继续改进我们的帮助内容。
            </p>
          )}
          <Separator className="my-4" />
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">相关文章</h3>
            <ul className="space-y-2">
              {relatedTopics.map((relatedTopic) => (
                <li key={relatedTopic.id}>
                  <Link
                    href={`/help/${relatedTopic.id}`}
                    className="text-primary hover:underline"
                  >
                    {relatedTopic.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
