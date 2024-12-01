import { Faq } from "@/components/faq";
import { Dependencies } from "@/components/dependencies";
import { DependencyGraph } from "@/components/dependency-graph";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/search";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("title")}</h1>
      <div className="flex justify-between items-center mb-8">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Search />
      <div className="space-y-16">
        <Faq />
        <Dependencies />
        <DependencyGraph />
      </div>
    </div>
  );
}
