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
import {
  User,
  Mail,
  MessageSquare,
  Phone,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ContactFormProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  successColor?: string;
  errorColor?: string;
  labels?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    submit?: string;
  };
  showIcons?: boolean;
  showLabels?: boolean;
  showPlaceholders?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

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
  phone: z.string().regex(/^[0-9+\-()\s]{10,15}$/, "请输入有效的电话号码"),
  subject: z
    .string()
    .min(3, "主题至少需要3个字符")
    .max(100, "主题不能超过100个字符"),
  message: z
    .string()
    .min(10, "消息至少需要10个字符")
    .max(1000, "消息不能超过1000个字符")
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9\s,.!?，。！？]+$/, "消息包含非法字符"),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm({
  className,
  primaryColor = "blue",
  secondaryColor = "purple",
  successColor = "green",
  errorColor = "red",
  labels = {
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    subject: "主题",
    message: "信息",
    submit: "发送消息",
  },
  showIcons = true,
  showLabels = true,
  showPlaceholders = true,
  rounded = "xl",
  shadow = "xl",
}: ContactFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isSubmitSuccessful },
    reset,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded];

  const shadowClass = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }[shadow];

  const onSubmit = async (formData: FormValues) => {
    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "消息已发送!",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>感谢您的留言，我们会尽快回复您。</span>
          </div>
        ),
        className: `bg-${successColor}-100 dark:bg-${successColor}-900/50 border-${successColor}-500 text-${successColor}-900 dark:text-${successColor}-100`,
      });
      reset();
    } catch (error) {
      toast({
        title: "发送失败",
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>消息发送失败，请稍后重试。</span>
          </div>
        ),
        className: `bg-${errorColor}-100 dark:bg-${errorColor}-900/50 border-${errorColor}-500 text-${errorColor}-900 dark:text-${errorColor}-100`,
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
      className={cn(
        `space-y-6 p-6 bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 max-w-2xl mx-auto`,
        `from-${primaryColor}-50/80 to-${secondaryColor}-50/50 dark:from-${primaryColor}-900/70 dark:to-${secondaryColor}-900/70`,
        roundedClass,
        shadowClass,
        className
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <AnimatePresence mode="wait">
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-${errorColor}-100 dark:bg-${errorColor}-900/50 p-4 rounded-lg mb-4 space-y-2`}
          >
            {Object.entries(errors).map(([key, error]) => (
              <div key={key} className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <p
                  className={`text-sm text-${errorColor}-600 dark:text-${errorColor}-300`}
                >
                  {error.message}
                </p>
              </div>
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
            {showLabels && (
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {showIcons && <User className="inline-block w-4 h-4 mr-2" />}
                {labels.name}
              </label>
            )}
            <div className="relative">
              {showIcons && (
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                {...field}
                id="name"
                className={cn(
                  "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                  showIcons && "pl-10",
                  errors.name &&
                    `border-${errorColor}-500 focus:border-${errorColor}-500`
                )}
                placeholder={showPlaceholders ? "请输入您的姓名" : undefined}
              />
            </div>
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
            {showLabels && (
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {showIcons && <Mail className="inline-block w-4 h-4 mr-2" />}
                {labels.email}
              </label>
            )}
            <div className="relative">
              {showIcons && (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                {...field}
                id="email"
                type="email"
                className={cn(
                  "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                  showIcons && "pl-10",
                  errors.email &&
                    `border-${errorColor}-500 focus:border-${errorColor}-500`
                )}
                placeholder={showPlaceholders ? "请输入您的邮箱" : undefined}
              />
            </div>
          </motion.div>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-2"
          >
            {showLabels && (
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {showIcons && <Phone className="inline-block w-4 h-4 mr-2" />}
                {labels.phone}
              </label>
            )}
            <div className="relative">
              {showIcons && (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                {...field}
                id="phone"
                type="tel"
                className={cn(
                  "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                  showIcons && "pl-10",
                  errors.phone &&
                    `border-${errorColor}-500 focus:border-${errorColor}-500`
                )}
                placeholder={
                  showPlaceholders ? "请输入您的电话号码" : undefined
                }
              />
            </div>
          </motion.div>
        )}
      />

      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-2"
          >
            {showLabels && (
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {showIcons && (
                  <BookOpen className="inline-block w-4 h-4 mr-2" />
                )}
                {labels.subject}
              </label>
            )}
            <div className="relative">
              {showIcons && (
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Input
                {...field}
                id="subject"
                className={cn(
                  "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                  showIcons && "pl-10",
                  errors.subject &&
                    `border-${errorColor}-500 focus:border-${errorColor}-500`
                )}
                placeholder={showPlaceholders ? "请输入主题" : undefined}
              />
            </div>
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-2"
          >
            {showLabels && (
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {showIcons && (
                  <MessageSquare className="inline-block w-4 h-4 mr-2" />
                )}
                {labels.message}
              </label>
            )}
            <div className="relative">
              {showIcons && (
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <Textarea
                {...field}
                id="message"
                className={cn(
                  "mt-1 block w-full dark:bg-gray-700/50 dark:text-white transition-all",
                  showIcons && "pl-10",
                  errors.message &&
                    `border-${errorColor}-500 focus:border-${errorColor}-500`
                )}
                placeholder={showPlaceholders ? "请输入您的信息" : undefined}
                rows={4}
              />
            </div>
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
            {isSubmitting ? "发送中..." : labels.submit}
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
