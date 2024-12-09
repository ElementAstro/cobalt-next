"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import zxcvbn from "zxcvbn";

export default function AdvancedPasswordInput() {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [strength, setStrength] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [passwordLength, setPasswordLength] = React.useState(16);
  const [useNumbers, setUseNumbers] = React.useState(true);
  const [useSymbols, setUseSymbols] = React.useState(true);

  const requirements = [
    { re: /.{8,}/, label: "至少8个字符" },
    { re: /[0-9]/, label: "至少一个数字" },
    { re: /[a-z]/, label: "至少一个小写字母" },
    { re: /[A-Z]/, label: "至少一个大写字母" },
    { re: /[^A-Za-z0-9]/, label: "至少一个特殊字符" },
  ];

  const calculateStrength = (pwd: string) => {
    const result = zxcvbn(pwd);
    return (result.score / 4) * 100;
  };

  React.useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+{}[]|:;<>,.?";
    let newPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="输入您的密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-20"
        />
        <div className="absolute right-0 top-0 h-full flex items-center space-x-1 mr-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showPassword ? "隐藏密码" : "显示密码"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>生成密码</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Progress value={strength} className="h-2 w-full" />
      </motion.div>
      <p className="text-sm text-muted-foreground">
        密码强度: {strength < 33 ? "弱" : strength < 66 ? "中" : "强"}
      </p>
      <AnimatePresence>
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {requirements.map((requirement, index) => (
              <RequirementItem
                key={index}
                label={requirement.label}
                isMet={requirement.re.test(password)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-4">
        <div>
          <Label htmlFor="password-length" className="text-sm font-medium">
            密码长度: {passwordLength}
          </Label>
          <Slider
            id="password-length"
            min={8}
            max={32}
            step={1}
            value={[passwordLength]}
            onValueChange={(value) => setPasswordLength(value[0])}
            className="mt-2"
          />
        </div>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span className="text-sm">包含数字</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="form-checkbox h-4 w-4"
            />
            <span className="text-sm">包含符号</span>
          </label>
        </div>
      </div>
      {password && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> 已复制
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> 复制密码
              </>
            )}
          </Button>
        </motion.div>
      )}
      <AnimatePresence>
        {strength < 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
            role="alert"
          >
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>您的密码较弱，请考虑使用更强的密码。</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RequirementItem({ label, isMet }: { label: string; isMet: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center space-x-2"
    >
      <div
        className={`h-2 w-2 rounded-full ${
          isMet ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <p className={`text-sm ${isMet ? "text-green-500" : "text-red-500"}`}>
        {label}
      </p>
    </motion.div>
  );
}
