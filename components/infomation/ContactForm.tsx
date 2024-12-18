"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "名字至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().min(10, "消息至少需要10个字符"),
});

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = "名字至少需要2个字符";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "请输入有效的邮箱地址";
    if (message.length < 10) errors.message = "消息至少需要10个字符";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus("sending");
    // 模拟发送请求
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", { name, email, message });
    toast({
      title: "消息已发送!",
      description: "感谢您的留言，我们会尽快回复您。",
    });
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitting(false);
    setSubmitStatus("success");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-4"
        >
          消息发送成功！
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          姓名
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的姓名"
        />
        {formErrors.name && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {formErrors.name}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          邮箱
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的邮箱"
        />
        {formErrors.email && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {formErrors.email}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          信息
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full dark:bg-gray-700 dark:text-white"
          placeholder="请输入您的信息"
          rows={4}
        />
        {formErrors.message && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {formErrors.message}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "发送中..." : "发送消息"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
