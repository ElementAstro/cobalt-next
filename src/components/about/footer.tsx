"use client";

import {
  Github,
  Star,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  ChevronRight,
  Telescope,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t("documentation"),
      links: [
        { label: t("gettingStarted"), href: "#" },
        { label: t("tutorials"), href: "#" },
        { label: t("api"), href: "#" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("blog"), href: "#" },
        { label: t("showcase"), href: "#" },
        { label: t("community"), href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-100" },
    { icon: Star, href: "#", label: "Star", color: "hover:text-yellow-400" },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-500",
    },
    { icon: Globe, href: "#", label: "Website", color: "hover:text-green-400" },
  ];

  return (
    <footer className="relative border-t bg-gradient-to-b from-background/80 to-background backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Telescope className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Lithium</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t("footer")}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-2">{t("newsletter")}</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="max-w-xs bg-background/50"
                />
                <Button variant="default" className="shrink-0">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    className="text-sm"
                  >
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t("contact")}</h3>
            <a
              href="mailto:support@example.com"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@example.com
            </a>

            {/* Social Links */}
            <div className="pt-4">
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:scale-110 transition-transform",
                      item.color
                    )}
                    asChild
                  >
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
          </div>
        </div>

        <Separator className="my-8 md:my-12 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Lithium Project.{" "}
            {t("allRightsReserved")}
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
