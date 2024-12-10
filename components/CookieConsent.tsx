"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "react-responsive";
import {
  useCookieStore,
  defaultCookieOptions,
  CookieConsentProps,
  CookieOption,
} from "@/lib/store/cookie";

export default function CookieConsent({
  privacyPolicyUrl = "/privacy-policy",
  cookieOptions = defaultCookieOptions,
  onAccept,
  onDecline,
  position = "bottom",
}: CookieConsentProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const {
    isVisible,
    acceptedOptions,
    showDetails,
    setIsVisible,
    setAcceptedOptions,
    toggleOption,
    setShowDetails,
  } = useCookieStore();

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

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: position === "bottom" ? 100 : -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
        height: { duration: 0.3 },
        opacity: { duration: 0.3, delay: 0.1 },
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`fixed ${position}-0 left-0 right-0 bg-gray-900 dark:bg-gray-800 text-white p-4 shadow-lg z-50 ${
          isMobile ? "px-2" : "px-4"
        }`}
      >
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            variants={childVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4"
          >
            <motion.p
              variants={childVariants}
              className="text-sm mb-4 sm:mb-0 pr-8"
            >
              我们使用cookies来改善您的浏览体验。您可以选择接受或拒绝这些cookies。
            </motion.p>
            <motion.div variants={childVariants} className="flex space-x-4">
              <Button onClick={handleAccept} variant="default">
                接受所选
              </Button>
              <Button onClick={handleDecline} variant="outline">
                仅必要
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={childVariants} className="mt-4">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
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
              >
                {cookieOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    variants={childVariants}
                    custom={index}
                    className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="pr-4">
                      <label htmlFor={option.id} className="font-medium">
                        {option.name}
                      </label>
                      <p className="text-sm text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    <Switch
                      id={option.id}
                      checked={acceptedOptions.includes(option.id)}
                      onCheckedChange={() =>
                        !option.isRequired && toggleOption(option.id)
                      }
                      disabled={option.isRequired}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div variants={childVariants} className="mt-4 text-sm">
            <a
              href={privacyPolicyUrl}
              className="text-blue-400 hover:underline"
            >
              查看隐私政策
            </a>
          </motion.div>
        </div>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
        >
          <X size={20} />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
