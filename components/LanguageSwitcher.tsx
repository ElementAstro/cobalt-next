"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

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
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const switchLocale =
    availableLocales.find((loc) => loc.code !== locale)?.code ||
    availableLocales[0].code;

  const handleSwitch = () => {
    router.push(pathname.replace(`/${locale}`, `/${switchLocale}`));
  };

  return (
    <Button
      onClick={handleSwitch}
      className={`fixed z-10 ${buttonStyle}`}
      style={{ ...position }}
      variant={buttonStyle}
    >
      {icon}
      {t("languageSwitch", {
        language: availableLocales.find((loc) => loc.code === switchLocale)
          ?.label,
      })}
    </Button>
  );
}
