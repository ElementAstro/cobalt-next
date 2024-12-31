"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronUp, ChevronDown, Check, ArrowRight } from "lucide-react";
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

interface EnhancedCookieConsentProps extends CookieConsentProps {
  customAnimation?: boolean;
  rememberExpiry?: number; // 记住选择的天数
  showRememberChoice?: boolean;
  compactMode?: boolean;
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
}: EnhancedCookieConsentProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
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
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={enhancedContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        className={`fixed ${position}-0 left-0 right-0 bg-gray-900 dark:bg-gray-800 text-white p-6 shadow-lg z-50 ${
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
            <motion.h2
              variants={childVariants}
              id="cookie-consent-title"
              className="text-lg font-semibold mb-4 sm:mb-0"
            >
              我们使用Cookies
            </motion.h2>
            <motion.div variants={childVariants} className="flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAccept}
                      variant="default"
                      aria-label="接受所选Cookies"
                    >
                      <Check className="w-4 h-4 mr-2" />
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
                      仅必要
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
