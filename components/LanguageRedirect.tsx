"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../config/languages";

export function LanguageRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.split("-")[0];
      return SUPPORTED_LANGUAGES.includes(browserLang)
        ? browserLang
        : DEFAULT_LANGUAGE;
    };

    const currentLang = pathname.split("/")[1];

    if (!SUPPORTED_LANGUAGES.includes(currentLang)) {
      const detectedLang = detectLanguage();
      router.replace(`/${detectedLang}${pathname}`);
    }
  }, [pathname, router]);

  return null;
}
