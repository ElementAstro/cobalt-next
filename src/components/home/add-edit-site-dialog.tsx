"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/types/home";
import { useSiteStore } from "@/store/useHomeStore";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// 定义zod验证模式
const siteSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "名称不能为空" }),
  url: z.string().url({ message: "请输入有效的URL" }),
  icon: z.string().min(1, { message: "图标不能为空" }),
  category: z.string().min(1, { message: "类别不能为空" }),
});

type SiteSchema = z.infer<typeof siteSchema>;

interface AddEditSiteDialogProps {
  editingSite: Site | null;
  setEditingSite: (site: Site | null) => void;
}

interface FormErrors {
  name?: string;
  url?: string;
  icon?: string;
  category?: string;
}

const AddEditSiteDialog: React.FC<AddEditSiteDialogProps> = ({
  editingSite,
  setEditingSite,
}) => {
  const icons = [
    { value: "camera", label: "相机" },
    { value: "telescope", label: "望远镜" },
    { value: "star", label: "星星" },
    { value: "moon", label: "月亮" },
    { value: "sun", label: "太阳" },
    { value: "planet", label: "行星" },
  ];

  const categories = [
    { value: "camera", label: "相机控制" },
    { value: "telescope", label: "望远镜控制" },
    { value: "guiding", label: "导星" },
    { value: "filter", label: "滤镜轮" },
    { value: "focuser", label: "调焦器" },
    { value: "weather", label: "天气" },
  ];

  const [site, setSite] = useState<Site>({
    id: "",
    name: "",
    url: "",
    icon: icons[0].value,
    category: categories[0].value,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [errors, setErrors] = useState<FormErrors>({});

  const addSite = useSiteStore((state) => state.addSite);
  const updateSite = useSiteStore((state) => state.updateSite);

  useEffect(() => {
    if (editingSite) {
      setSite(editingSite);
    }
  }, [editingSite]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validation = siteSchema.safeParse(site);

      if (!validation.success) {
        const fieldErrors: FormErrors = {};
        validation.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof FormErrors;
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      if (editingSite) {
        await updateSite(site);
        toast({
          title: "站点更新成功",
          description: `${site.name} 已成功更新`,
          variant: "default",
        });
      } else {
        await addSite(site);
        toast({
          title: "站点添加成功",
          description: `${site.name} 已成功添加`,
          action: <CheckCircle className="text-green-500" />,
        });
      }

      setSite({
        id: "",
        name: "",
        url: "",
        icon: icons[0].value,
        category: categories[0].value
      });
      setErrors({});
      setEditingSite(null);
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "未知错误",
        action: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto bg-indigo-900">
      <CardHeader>
        <CardTitle>{editingSite ? "编辑站点" : "添加站点"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="name" className="text-center">
              名称
            </Label>
            <div className="col-span-4">
              <Input
                id="name"
                value={site.name}
                onChange={(e) => setSite({ ...site, name: e.target.value })}
                className={`bg-indigo-800 text-white border-indigo-700 ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="请输入网站名称"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="url" className="text-center">
              URL
            </Label>
            <div className="col-span-4">
              <Input
                id="url"
                value={site.url}
                onChange={(e) => setSite({ ...site, url: e.target.value })}
                className={`bg-indigo-800 text-white border-indigo-700 ${
                  errors.url ? "border-red-500" : ""
                }`}
                placeholder="请输入网站URL"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-500">{errors.url}</p>
              )}
            </div>
          </div>
          <motion.div
            className="grid grid-cols-5 items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Label htmlFor="icon" className="text-center">
              图标
            </Label>
            <div className="col-span-4">
              <Select
                value={site.icon}
                onValueChange={(value) => setSite({ ...site, icon: value })}
              >
                <SelectTrigger className="bg-indigo-800 text-white border-indigo-700">
                  <SelectValue placeholder="选择图标" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 border-indigo-700">
                  {icons.map((icon) => (
                    <SelectItem
                      key={icon.value}
                      value={icon.value}
                      className="hover:bg-indigo-700"
                    >
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.icon && (
                <motion.p
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.icon}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-5 items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="category" className="text-center">
              类别
            </Label>
            <div className="col-span-4">
              <Select
                value={site.category}
                onValueChange={(value) => setSite({ ...site, category: value })}
              >
                <SelectTrigger className="bg-indigo-800 text-white border-indigo-700">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 border-indigo-700">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value}
                      className="hover:bg-indigo-700"
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <motion.p
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.category}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-500 text-white w-full"
        >
          {editingSite ? "更新站点" : "添加站点"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddEditSiteDialog;
