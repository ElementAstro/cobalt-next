"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/types/home";
import { useSiteStore } from "@/store/useHomeStore";
import { z } from "zod";
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
  const [site, setSite] = useState<Site>({
    id: "",
    name: "",
    url: "",
    icon: "",
    category: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const addSite = useSiteStore((state) => state.addSite);
  const updateSite = useSiteStore((state) => state.updateSite);

  useEffect(() => {
    if (editingSite) {
      setSite(editingSite);
    }
  }, [editingSite]);

  const handleSubmit = () => {
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
      updateSite(site);
    } else {
      addSite(site);
    }
    setSite({ id: "", name: "", url: "", icon: "", category: "" });
    setErrors({});
    setEditingSite(null);
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
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="icon" className="text-center">
              图标
            </Label>
            <div className="col-span-4">
              <Input
                id="icon"
                value={site.icon}
                onChange={(e) => setSite({ ...site, icon: e.target.value })}
                className={`bg-indigo-800 text-white border-indigo-700 ${
                  errors.icon ? "border-red-500" : ""
                }`}
                placeholder="请输入图标名称"
              />
              {errors.icon && (
                <p className="mt-1 text-sm text-red-500">{errors.icon}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="category" className="text-center">
              类别
            </Label>
            <div className="col-span-4">
              <Input
                id="category"
                value={site.category}
                onChange={(e) => setSite({ ...site, category: e.target.value })}
                className={`bg-indigo-800 text-white border-indigo-700 ${
                  errors.category ? "border-red-500" : ""
                }`}
                placeholder="请输入类别"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>
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
