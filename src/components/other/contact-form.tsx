"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "名字至少需要2个字符")
    .max(50, "名字不能超过50个字符")
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, "名字只能包含中文、英文和空格"),
  email: z
    .string()
    .email("请输入有效的邮箱地址")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "请输入有效的邮箱地址"
    ),
  message: z
    .string()
    .min(10, "消息至少需要10个字符")
    .max(1000, "消息不能超过1000个字符")
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s,.!?，。！？]+$/, "消息包含非法字符"),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "消息已发送!",
        description: "感谢您的留言，我们会尽快回复您。",
      });
      reset();
    } catch (error) {
      toast({
        title: "发送失败",
        description: "消息发送失败，请稍后重试。",
        variant: "destructive",
      });
    }
  };

  // 实时验证字段
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) trigger(name);
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <AnimatePresence>
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg mb-4 space-y-2"
          >
            {Object.entries(errors).map(([key, error]) => (
              <p key={key} className="text-sm text-red-600 dark:text-red-300">
                {error.message}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              姓名
            </label>
            <Input
              {...field}
              id="name"
              className={cn(
                "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                errors.name && "border-red-500 focus:border-red-500"
              )}
              placeholder="请输入您的姓名"
            />
          </motion.div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              邮箱
            </label>
            <Input
              {...field}
              id="email"
              type="email"
              className={cn(
                "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                errors.email && "border-red-500 focus:border-red-500"
              )}
              placeholder="请输入您的邮箱"
            />
          </motion.div>
        )}
      />

      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-2"
          >
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              信息
            </label>
            <Textarea
              {...field}
              id="message"
              className={cn(
                "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                errors.message && "border-red-500 focus:border-red-500"
              )}
              placeholder="请输入您的信息"
              rows={4}
            />
          </motion.div>
        )}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative overflow-hidden"
        >
          <span className="relative z-10">
            {isSubmitting ? "发送中..." : "发送消息"}
          </span>
          {isSubmitting && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            />
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
