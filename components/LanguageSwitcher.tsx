"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  buttonStyle?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost";
  availableLocales?: { code: string; label: string }[];
  icon?: React.ReactNode;
}

export function LanguageSwitcher({
  position = { top: "4px", right: "4px" },
  buttonStyle = "outline",
  availableLocales = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
  ],
  icon = <Globe className="mr-2" />,
}: LanguageSwitcherProps) {
  const { language, switchLanguage, t } = useLanguage();

  const nextLanguage = availableLocales.find((loc) => loc.code !== language);

  return (
    <Button
      onClick={switchLanguage}
      className="fixed z-10"
      style={{ ...position }}
      variant={buttonStyle}
    >
      {icon}
      {nextLanguage?.label || availableLocales[0].label}
    </Button>
  );
}
