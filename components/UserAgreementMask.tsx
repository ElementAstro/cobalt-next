"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaQuery } from "react-responsive";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
}: UserAgreementMaskProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [lastAgreedDate, setLastAgreedDate] = useState<string | null>(null);
  const [isAgreementDisabled, setIsAgreementDisabled] = useState(
    requireReadConfirmation
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const storedVersion = localStorage.getItem("userAgreedVersion");
    const storedDate = localStorage.getItem("userAgreedDate");
    if (!storedVersion || storedVersion !== version) {
      setIsVisible(true);
    }
    if (storedDate) {
      setLastAgreedDate(new Date(storedDate).toLocaleString());
    }
  }, [version]);

  const handleAgree = () => {
    if (requireReadConfirmation && (!hasReadAgreement || !hasReadPrivacy)) {
      setHasInteracted(true);
      return;
    }
    const now = new Date().toISOString();
    localStorage.setItem("userAgreedVersion", version);
    localStorage.setItem("userAgreedDate", now);
    setLastAgreedDate(new Date(now).toLocaleString());
    setIsVisible(false);
    onAgree();
  };

  const handleDisagree = () => {
    setHasInteracted(true);
    onDisagree();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6 space-y-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  {language === "en" ? title : "用户协议与隐私政策"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {language === "en"
                    ? `Version: ${version}`
                    : `版本: ${version}`}
                </CardDescription>
                {lastAgreedDate && (
                  <CardDescription className="text-sm text-gray-400">
                    {language === "en"
                      ? `Last agreed: ${lastAgreedDate}`
                      : `上次同意时间: ${lastAgreedDate}`}
                  </CardDescription>
                )}
              </CardHeader>
              <Tabs defaultValue="agreement" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="agreement" className="text-white">
                    {language === "en" ? "Agreement" : "用户协议"}
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="text-white">
                    {language === "en" ? "Privacy" : "隐私政策"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="agreement">
                  <ScrollArea className="h-60 md:h-72 lg:h-80 mb-4">
                    <p className="text-sm text-gray-300">
                      {agreementText[language]}
                    </p>
                  </ScrollArea>
                  {requireReadConfirmation && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreement-read"
                        checked={hasReadAgreement}
                        onCheckedChange={(checked) => {
                          setHasReadAgreement(checked as boolean);
                          setIsAgreementDisabled(
                            requireReadConfirmation &&
                              (!(checked as boolean) || !hasReadPrivacy)
                          );
                        }}
                      />
                      <label
                        htmlFor="agreement-read"
                        className="text-sm text-gray-300"
                      >
                        {language === "en"
                          ? "I have read and understood the User Agreement"
                          : "我已阅读并理解用户协议"}
                      </label>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="privacy">
                  <ScrollArea className="h-60 md:h-72 lg:h-80 mb-4">
                    <p className="text-sm text-gray-300">
                      {privacyPolicyText[language]}
                    </p>
                  </ScrollArea>
                  {requireReadConfirmation && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy-read"
                        checked={hasReadPrivacy}
                        onCheckedChange={(checked) => {
                          setHasReadPrivacy(checked as boolean);
                          setIsAgreementDisabled(
                            requireReadConfirmation &&
                              (!hasReadAgreement || !(checked as boolean))
                          );
                        }}
                      />
                      <label
                        htmlFor="privacy-read"
                        className="text-sm text-gray-300"
                      >
                        {language === "en"
                          ? "I have read and understood the Privacy Policy"
                          : "我已阅读并理解隐私政策"}
                      </label>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleAgree}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isAgreementDisabled}
                >
                  {language === "en" ? "Agree and Continue" : "同意并继续"}
                </Button>
                <Button
                  onClick={handleDisagree}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {language === "en" ? "Disagree" : "不同意"}
                </Button>
              </div>
              {allowPrint && (
                <div className="flex justify-center">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {language === "en" ? "Print" : "打印"}
                  </Button>
                </div>
              )}
              {hasInteracted && (
                <motion.p
                  className="text-red-500 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
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