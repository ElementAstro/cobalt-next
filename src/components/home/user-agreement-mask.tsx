"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Printer,
  Info,
  Settings,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { create } from "zustand";
import { useMediaQuery } from "react-responsive";
import { toast } from "@/hooks/use-toast";

interface AgreementStore {
  isVisible: boolean;
  showAgreement: () => void;
  hideAgreement: () => void;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
  hasReadAgreement: boolean;
  setHasReadAgreement: (value: boolean) => void;
  hasReadPrivacy: boolean;
  setHasReadPrivacy: (value: boolean) => void;
}

const useAgreementStore = create<AgreementStore>((set) => ({
  isVisible: false,
  showAgreement: () => set({ isVisible: true }),
  hideAgreement: () => set({ isVisible: false }),
  hasInteracted: false,
  setHasInteracted: (value) => set({ hasInteracted: value }),
  hasReadAgreement: false,
  setHasReadAgreement: (value) => set({ hasReadAgreement: value }),
  hasReadPrivacy: false,
  setHasReadPrivacy: (value) => set({ hasReadPrivacy: value }),
}));

interface UserAgreementMaskProps {
  agreementText: Record<string, string>;
  privacyPolicyText: Record<string, string>;
  onAgree: () => void;
  onDisagree: () => void;
  language: string;
  version: string;
  requireReadConfirmation?: boolean;
  title?: string;
  allowPrint?: boolean;
  animationDuration?: number;
  mobileBreakpoint?: number;
  maxHeight?: string;
  backdropFilter?: boolean;
}

export function UserAgreementMask({
  agreementText,
  privacyPolicyText,
  onAgree,
  onDisagree,
  language = "en",
  version,
  requireReadConfirmation = false,
  title = "User Agreement & Privacy Policy",
  allowPrint = false,
  animationDuration = 0.3,
  mobileBreakpoint = 768,
  maxHeight = "90vh",
  backdropFilter = true,
}: UserAgreementMaskProps) {
  const {
    isVisible,
    hideAgreement,
    hasInteracted,
    setHasInteracted,
    hasReadAgreement,
    setHasReadAgreement,
    hasReadPrivacy,
    setHasReadPrivacy,
  } = useAgreementStore();
  const isMobile = useMediaQuery({ maxWidth: mobileBreakpoint });
  const [animation, setAnimation] = useState<Variants>({
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 50 },
  });

  useEffect(() => {
    const storedVersion = localStorage.getItem("userAgreedVersion");
    if (!storedVersion || storedVersion !== version) {
      useAgreementStore.getState().showAgreement();
    }
  }, [version]);

  const handleAgree = () => {
    if (requireReadConfirmation && (!hasReadAgreement || !hasReadPrivacy)) {
      setHasInteracted(true);
      toast({
        title: language === "en" ? "Attention Required" : "需要关注",
        description:
          language === "en"
            ? "Please read both the Agreement and Privacy Policy before continuing."
            : "请先阅读用户协议和隐私政策",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const now = new Date().toISOString();
    localStorage.setItem("userAgreedVersion", version);
    localStorage.setItem("userAgreedDate", now);
    hideAgreement();
    onAgree();
    toast({
      title: language === "en" ? "Agreement Accepted" : "协议已接受",
      description:
        language === "en"
          ? "Thank you for accepting our terms."
          : "感谢您接受我们的条款",
      duration: 2000,
    });
  };

  const handleDisagree = () => {
    setHasInteracted(true);
    onDisagree();
    toast({
      title: language === "en" ? "Agreement Declined" : "协议已拒绝",
      description:
        language === "en"
          ? "You have declined the agreement. Some features may be limited."
          : "您已拒绝协议，部分功能可能受限",
      variant: "destructive",
      duration: 3000,
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem("userAgreedVersion", version);
    const now = new Date().toISOString();
    localStorage.setItem("userAgreedDate", now);
    hideAgreement();
    onAgree();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 ${
            backdropFilter ? "backdrop-filter backdrop-blur-sm" : ""
          } bg-black/60 flex items-center justify-center p-4 z-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationDuration }}
        >
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col ${
              isMobile ? "max-h-screen" : `max-h-[${maxHeight}]`
            }`}
            variants={animation}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            key="modal"
          >
            <div className="p-6 relative flex flex-col flex-grow space-y-6">
              <Button
                onClick={() => hideAgreement()}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                aria-label="关闭用户协议"
              >
                <X size={20} />
              </Button>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Info className="w-6 h-6 text-blue-500" />
                  {language === "en" ? title : "用户协议与隐私政策"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                  <Settings className="w-4 h-4" />
                  {language === "en"
                    ? `Version: ${version}`
                    : `版本: ${version}`}
                </CardDescription>
              </CardHeader>
              <Tabs
                defaultValue="agreement"
                className="flex-1 flex flex-col space-y-4 overflow-hidden"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-700">
                  <TabsTrigger
                    value="agreement"
                    className="text-gray-900 dark:text-white"
                  >
                    {language === "en" ? "Agreement" : "用户协议"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="text-gray-900 dark:text-white"
                  >
                    {language === "en" ? "Privacy" : "隐私政策"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="agreement"
                  className="flex flex-col flex-grow"
                >
                  <ScrollArea className="flex-grow mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {language === "en"
                        ? agreementText["en"]
                        : agreementText["zh"]}
                    </p>
                  </ScrollArea>
                  {requireReadConfirmation && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreement-read"
                        checked={hasReadAgreement}
                        onCheckedChange={(checked) => {
                          setHasReadAgreement(checked as boolean);
                        }}
                        className="text-blue-600"
                      />
                      <Label
                        htmlFor="agreement-read"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {language === "en"
                          ? "I have read and understood the Agreement"
                          : "我已阅读并理解用户协议"}
                      </Label>
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="privacy"
                  className="flex flex-col flex-grow"
                >
                  <ScrollArea className="flex-grow mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {language === "en"
                        ? privacyPolicyText["en"]
                        : privacyPolicyText["zh"]}
                    </p>
                  </ScrollArea>
                  {requireReadConfirmation && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy-read"
                        checked={hasReadPrivacy}
                        onCheckedChange={(checked) => {
                          setHasReadPrivacy(checked as boolean);
                        }}
                        className="text-blue-600"
                      />
                      <Label
                        htmlFor="privacy-read"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        {language === "en"
                          ? "I have read and understood the Privacy Policy"
                          : "我已阅读并理解隐私政策"}
                      </Label>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleAgree}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  disabled={
                    requireReadConfirmation &&
                    (!hasReadAgreement || !hasReadPrivacy)
                  }
                >
                  {language === "en" ? "Agree and Continue" : "同意并继续"}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={handleDisagree}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
                >
                  {language === "en" ? "Disagree" : "不同意"}
                  <X className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {allowPrint && (
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
                  >
                    {language === "en" ? "Print" : "打印"}
                    <Printer className="w-4 h-4 ml-2" />
                  </Button>
                )}
                <Button
                  onClick={handleSavePreferences}
                  variant="secondary"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                >
                  {language === "en" ? "Save Preferences" : "保存偏好设置"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              {hasInteracted && (
                <motion.p
                  className="text-red-500 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {language === "en"
                    ? "You must agree to the User Agreement and Privacy Policy to continue using our services."
                    : "您必须同意用户协议和隐私政策才能继续使用我们的服务。"}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
