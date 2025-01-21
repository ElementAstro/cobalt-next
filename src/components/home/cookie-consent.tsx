"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  X,
  ChevronUp,
  ChevronDown,
  Check,
  ArrowRight,
  Settings,
  Info,
  Shield,
  Cookie,
  AlertTriangle,
  Clock,
  BookOpen,
  HardDrive,
  Eye,
  EyeOff,
  List,
  FileText,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useMediaQuery } from "react-responsive";
import {
  useCookieConsentStore,
  defaultCookieOptions,
  CookieConsentProps,
  CookieOption,
} from "@/store/useStorageStore";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// 添加审计日志类型定义
interface AuditLogEntry {
  action: string;
  timestamp: string;
  details: string;
}

interface EnhancedCookieConsentProps extends CookieConsentProps {
  customAnimation?: boolean;
  rememberExpiry?: number;
  showRememberChoice?: boolean;
  compactMode?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  showAdvancedSettings?: boolean;
  showPolicyPreview?: boolean;
  showAuditLog?: boolean;
  showExpirationTracking?: boolean;
  consentMode?: "basic" | "advanced";
  customIcons?: {
    accept?: React.ReactNode;
    decline?: React.ReactNode;
    settings?: React.ReactNode;
    info?: React.ReactNode;
  };
}

export default function CookieConsent({
  privacyPolicyUrl = "/privacy-policy",
  cookieOptions = defaultCookieOptions,
  onAccept,
  onDecline,
  position = "bottom",
  customAnimation = true,
  rememberExpiry = 365,
  showRememberChoice = true,
  compactMode = false,
  primaryColor = "#1e40af",
  secondaryColor = "#1e3a8a",
  accentColor = "#60a5fa",
  showAdvancedSettings = true,
  showPolicyPreview = true,
  showAuditLog = true,
  showExpirationTracking = true,
  consentMode = "basic",
  customIcons = {},
}: EnhancedCookieConsentProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [cookieSearch, setCookieSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("categories");
  const [isLoading, setIsLoading] = useState(false);
  const {
    isVisible,
    acceptedOptions,
    showDetails,
    setIsVisible,
    setAcceptedOptions,
    toggleOption,
    setShowDetails,
  } = useCookieConsentStore();
  const [rememberChoice, setRememberChoice] = useState(false);

  // 添加审计日志状态
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // 添加审计日志函数
  const addAuditEntry = useCallback((action: string, details: string) => {
    setAuditLog((prev) => [
      ...prev,
      {
        action,
        timestamp: new Date().toISOString(),
        details,
      },
    ]);
  }, []);

  const handleRememberChoiceChange = useCallback(
    (checked: boolean) => {
      setRememberChoice(checked);
      toast({
        title: checked ? "选择已记住" : "选择未记住",
        description: `您的选择将${
          checked ? "" : "不"
        }被记住 ${rememberExpiry} 天`,
        duration: 2000,
      });
    },
    [rememberExpiry, toast]
  );

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        setIsVisible(true);
      } else {
        const parsedConsent = JSON.parse(consent);
        if (parsedConsent && Array.isArray(parsedConsent.options)) {
          setAcceptedOptions(parsedConsent.options);
        } else {
          setIsVisible(true);
          toast({
            title: "Cookie 设置无效",
            description: "检测到无效的 Cookie 设置，已重置",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error reading cookie consent:", error);
      setIsVisible(true);
      toast({
        title: "读取 Cookie 设置失败",
        description: "无法读取 Cookie 设置，请重新选择",
        variant: "destructive",
      });
    }
  }, [setIsVisible, setAcceptedOptions, toast]);

  useEffect(() => {
    try {
      setAcceptedOptions((prev: string[]) => {
        const requiredOptions: string[] = cookieOptions
          .filter((option: CookieOption) => option.isRequired)
          .map((option: CookieOption) => option.id);

        if (!requiredOptions.length) {
          toast({
            title: "缺少必要 Cookie",
            description: "未找到任何必要的 Cookie 设置",
            variant: "destructive",
          });
        }

        const newOptions: string[] = prev.concat(requiredOptions);
        return Array.from(new Set(newOptions));
      });
    } catch (error) {
      console.error("Error initializing required cookies:", error);
      toast({
        title: "初始化失败",
        description: "无法初始化必要的 Cookie 设置",
        variant: "destructive",
      });
    }
  }, [cookieOptions, setAcceptedOptions, toast]);

  // 修改现有的处理函数来包含审计
  const handleAccept = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify({
          options: acceptedOptions,
          timestamp: new Date().toISOString(),
          remember: rememberChoice,
        })
      );
      setIsVisible(false);
      onAccept?.(acceptedOptions);
      toast({
        title: "设置已保存",
        description: "您的 Cookie 偏好设置已成功保存",
        duration: 2000,
      });
      addAuditEntry(
        "accept",
        `Accepted cookies: ${acceptedOptions.join(", ")}`
      );
    } catch (error) {
      toast({
        title: "错误",
        description: "保存设置时出错，请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [acceptedOptions, onAccept, rememberChoice, toast, addAuditEntry]);

  const handleDecline = useCallback(async () => {
    setIsLoading(true);
    try {
      const requiredOptions = cookieOptions
        .filter((option) => option.isRequired)
        .map((option) => option.id);
      localStorage.setItem("cookieConsent", JSON.stringify(requiredOptions));
      setIsVisible(false);
      onDecline?.();
      toast({
        title: "仅必要 Cookies",
        description: "已仅接受必要的 Cookies",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "保存 Cookie 设置时出错，请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cookieOptions, onDecline, toast]);

  const handleSavePreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify({
          options: acceptedOptions,
          timestamp: new Date().toISOString(),
          remember: rememberChoice,
        })
      );
      setIsVisible(false);
      onAccept?.(acceptedOptions);
      toast({
        title: "偏好设置已保存",
        description: "您的 Cookie 偏好设置已成功保存",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "保存偏好设置时出错，请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [acceptedOptions, onAccept, rememberChoice, toast]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: position === "bottom" ? 100 : -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: position === "bottom" ? 100 : -100,
      transition: { duration: 0.3 },
    },
  };

  const enhancedContainerVariants: Variants = {
    ...containerVariants,
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const detailsVariants: Variants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4 },
        opacity: { duration: 0.4, delay: 0.1 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  const filteredCookies = useMemo(() => {
    return cookieOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(cookieSearch.toLowerCase()) ||
        option.description.toLowerCase().includes(cookieSearch.toLowerCase())
    );
  }, [cookieOptions, cookieSearch]);

  const cookieExpirationProgress = useMemo(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (!storedConsent) return 0;

    try {
      const consentData = JSON.parse(storedConsent);
      if (!consentData.timestamp) return 0;

      const consentDate = new Date(consentData.timestamp);
      const daysSinceConsent = Math.floor(
        (new Date().getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const progress = Math.min((daysSinceConsent / rememberExpiry) * 100, 100);

      if (progress >= 100) {
        toast({
          title: "Cookie 设置已过期",
          description: "您的 Cookie 偏好设置已过期，请重新选择",
          duration: 3000,
        });
        setIsVisible(true);
      }

      return progress;
    } catch (error) {
      console.error("Error parsing cookie consent data:", error);
      return 0;
    }
  }, [rememberExpiry, toast]);

  const renderAdvancedSettings = () => (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="categories">分类</TabsTrigger>
        <TabsTrigger value="details">详细信息</TabsTrigger>
        <TabsTrigger value="preferences">偏好设置</TabsTrigger>
      </TabsList>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <TabsContent value="categories">
          <div className="space-y-4">
            {cookieOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between"
              >
                <div>
                  <Label htmlFor={option.id}>{option.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Switch
                  id={option.id}
                  checked={acceptedOptions.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                  disabled={option.isRequired}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="details">
          <div className="space-y-4">
            <div>
              <Label>Cookie 搜索</Label>
              <Input
                value={cookieSearch}
                onChange={(e) => setCookieSearch(e.target.value)}
                placeholder="搜索Cookie..."
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Cookie 详细信息</Label>
              <Textarea
                value={JSON.stringify(filteredCookies, null, 2)}
                readOnly
                className="h-[200px]"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preferences">
          <div className="space-y-4">
            <div>
              <Label>Cookie 过期进度</Label>
              <Progress value={cookieExpirationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                您的Cookie设置将在
                {Math.floor(
                  rememberExpiry -
                    (rememberExpiry * cookieExpirationProgress) / 100
                )}
                天后过期
              </p>
            </div>
            <Separator />
            <div className="flex items-center space-x-2">
              <Switch
                id="remember-choice"
                checked={rememberChoice}
                onCheckedChange={handleRememberChoiceChange}
              />
              <Label htmlFor="remember-choice">
                记住我的选择 {rememberExpiry} 天
              </Label>
            </div>
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );

  // 添加高级设置模态框渲染函数
  const renderSettingsModal = () => (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cookie 高级设置</DialogTitle>
          <DialogDescription>自定义您的 Cookie 偏好设置</DialogDescription>
        </DialogHeader>
        {renderAdvancedSettings()}
        <DialogFooter>
          <Button onClick={() => setShowSettingsModal(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // 添加审计日志模态框渲染函数
  const renderAuditModal = () => (
    <Dialog open={showAuditModal} onOpenChange={setShowAuditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cookie 审计日志</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {/* Main Consent Banner */}
      <motion.div
        variants={enhancedContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        style={{
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
        }}
        className={`fixed ${position}-0 left-0 right-0 text-white p-6 shadow-lg z-50 border-t ${
          isMobile ? "px-3" : "px-6"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={childVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6"
          >
            <motion.div className="flex items-center space-x-4">
              <Cookie className="w-6 h-6" />
              <motion.h2
                variants={childVariants}
                id="cookie-consent-title"
                className="text-lg font-semibold mb-4 sm:mb-0"
              >
                我们使用Cookies
              </motion.h2>
            </motion.div>

            <motion.div variants={childVariants} className="flex space-x-4">
              {showAdvancedSettings && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setShowSettingsModal(true)}
                        variant="ghost"
                        size="icon"
                        aria-label="高级设置"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>打开高级Cookie设置</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAccept}
                      variant="default"
                      aria-label="接受所选Cookies"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      {customIcons.accept || <Check className="w-4 h-4 mr-2" />}
                      接受所选
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>接受选定的Cookie类别</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      aria-label="仅接受必要的Cookies"
                    >
                      {customIcons.decline || "仅必要"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>仅接受必要的Cookie，不接受其他类型的Cookie</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSavePreferences}
                      variant="secondary"
                      aria-label="保存我的偏好设置"
                    >
                      保存偏好设置
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>保存您的Cookie偏好设置</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
          <motion.div variants={childVariants} className="mt-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
              aria-expanded={showDetails}
              aria-controls="cookie-details"
            >
              {showDetails ? "隐藏详情" : "显示详情"}
              {showDetails ? (
                <ChevronUp className="ml-2" size={16} />
              ) : (
                <ChevronDown className="ml-2" size={16} />
              )}
            </Button>
          </motion.div>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-4 overflow-hidden"
                id="cookie-details"
              >
                <Accordion type="multiple">
                  {cookieOptions.map((option, index) => (
                    <AccordionItem key={option.id} value={`item-${index}`}>
                      <AccordionTrigger className="text-sm">
                        {option.name}
                        {option.isRequired && (
                          <Badge variant="destructive" className="ml-2">
                            必需
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-400 text-sm mb-2">
                          {option.description}
                        </p>
                        {!option.isRequired && (
                          <Switch
                            id={option.id}
                            checked={acceptedOptions.includes(option.id)}
                            onCheckedChange={() => toggleOption(option.id)}
                            aria-label={`切换${option.name} Cookie`}
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
          {showRememberChoice && (
            <motion.div
              variants={childVariants}
              className="mt-4 flex items-center"
            >
              <Switch
                id="remember-choice"
                checked={rememberChoice}
                onCheckedChange={setRememberChoice}
                aria-label="记住我的选择"
              />
              <label htmlFor="remember-choice" className="ml-2 text-sm">
                记住我的选择 {rememberExpiry} 天
              </label>
            </motion.div>
          )}
          <motion.div variants={childVariants} className="mt-4 text-sm">
            <a
              href={privacyPolicyUrl}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              查看隐私政策
            </a>
          </motion.div>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
          aria-label="关闭Cookie同意框"
        >
          <X size={20} />
        </Button>
      </motion.div>
      {showSettingsModal && renderSettingsModal()}
      {showAuditModal && renderAuditModal()}
      {showPolicyModal && (
        <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>隐私政策预览</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <div className="prose dark:prose-invert">
                {/* Add your privacy policy content here */}
                <h2>隐私政策</h2>
                <p>这是您的隐私政策内容...</p>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
