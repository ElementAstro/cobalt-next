"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { App } from "@/types/extra";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Code, ImageIcon, Settings, Wrench } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "应用名称不能为空")
    .max(50, "应用名称不能超过50个字符")
    .regex(
      /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_]+$/,
      "名称只能包含字母、数字、中文、空格、-和_"
    ),
  category: z.enum(["microsoft", "system", "tools", "development", "media"], {
    required_error: "请选择应用类别",
  }),
  url: z
    .string()
    .url("请输入有效的URL")
    .refine((val) => val.startsWith("https://"), "必须使用HTTPS协议"),
  icon: z.string().url("请输入有效的图标URL").optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAppDialogProps {
  onAddApp: (newApp: App) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddAppDialog({
  onAddApp,
  open,
  onOpenChange,
}: AddAppDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "tools",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const newApp: App = {
        id: Date.now().toString(),
        name: values.name,
        category: values.category,
        isPinned: false,
        url: values.url,
        description: values.description || "",
        icon: values.icon || "/placeholder.svg?height=32&width=32",
      };
      await onAddApp(newApp);
      form.reset();
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to add app:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          添加应用
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            添加新应用
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>应用名称</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="输入应用名称"
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>类别</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择应用类别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value="microsoft"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        微软应用
                      </SelectItem>
                      <SelectItem
                        value="system"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        系统工具
                      </SelectItem>
                      <SelectItem
                        value="tools"
                        className="flex items-center gap-2"
                      >
                        <Wrench className="h-4 w-4" />
                        常用工具
                      </SelectItem>
                      <SelectItem
                        value="development"
                        className="flex items-center gap-2"
                      >
                        <Code className="h-4 w-4" />
                        开发工具
                      </SelectItem>
                      <SelectItem
                        value="media"
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        媒体工具
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange?.(false)}
                className="w-full sm:w-auto"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "添加中..." : "添加"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
