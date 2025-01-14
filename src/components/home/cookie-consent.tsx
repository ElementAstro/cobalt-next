"use client";

import { useState, useEffect, useMemo } from "react";
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
  History
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

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    } else {
      setAcceptedOptions(JSON.parse(consent));
    }
  }, [setIsVisible, setAcceptedOptions]);

  useEffect(() => {
    setAcceptedOptions((prev: string[]) => {
      const requiredOptions: string[] = cookieOptions
        .filter((option: CookieOption) => option.isRequired)
        .map((option: CookieOption) => option.id);
      const newOptions: string[] = prev.concat(requiredOptions);
      return Array.from(new Set(newOptions));
    });
  }, [cookieOptions, setAcceptedOptions]);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(acceptedOptions));
    setIsVisible(false);
    onAccept?.(acceptedOptions);
  };

  const handleDecline = () => {
    const requiredOptions = cookieOptions
      .filter((option) => option.isRequired)
      .map((option) => option.id);
    localStorage.setItem("cookieConsent", JSON.stringify(requiredOptions));
    setIsVisible(false);
    onDecline?.();
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(acceptedOptions));
    setIsVisible(false);
    onAccept?.(acceptedOptions);
  };

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
    }
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    }
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
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const filteredCookies = useMemo(() => {
    return cookieOptions.filter(option => 
      option.name.toLowerCase().includes(cookieSearch.toLowerCase()) ||
      option.description.toLowerCase().includes(cookieSearch.toLowerCase())
    );
  }, [cookieOptions, cookieSearch]);

  const cookieExpirationProgress = useMemo(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (!storedConsent) return 0;
    
    const consentDate = new Date(JSON.parse(storedConsent).timestamp);
    const daysSinceConsent = Math.floor(
      (new Date().getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return Math.min((daysSinceConsent / rememberExpiry) * 100, 100);
  }, [rememberExpiry]);

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
          borderColor: secondaryColor
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
    </AnimatePresence>
  );
}
