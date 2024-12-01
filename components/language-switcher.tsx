"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const switchLocale = locale === "en" ? "zh" : "en";

  const handleSwitch = () => {
    router.push(pathname.replace(`/${locale}`, `/${switchLocale}`));
  };

  return (
    <Button
      onClick={handleSwitch}
      className="fixed top-4 right-4 z-10"
      variant="outline"
    >
      <Globe className="mr-2" />
      {t("languageSwitch", {
        language: switchLocale === "en" ? "English" : "中文",
      })}
    </Button>
  );
}
