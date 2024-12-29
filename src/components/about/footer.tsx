"use client";

import { Github, Star, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("about")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("links")}</h3>
            <div className="flex gap-2">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Star, href: "#", label: "Star" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((item) => (
                <Button key={item.label} variant="ghost" size="icon" asChild>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold">{t("contact")}</h3>
            <p className="text-sm text-muted-foreground">support@example.com</p>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lithium Project. {t("allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
