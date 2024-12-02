"use client";

import { Github, Star, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.footerBackground};
  padding: 2rem 0;
  text-align: center;
  transition: background-color 0.3s;
`;

const IconLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;

  a {
    color: ${({ theme }) => theme.iconColor};
    transition: color 0.3s;

    &:hover {
      color: ${({ theme }) => theme.iconHoverColor};
    }
  }
`;

export default function Footer() {
  const { t } = useLanguage();

  return (
    <FooterWrapper>
      <div className="container mx-auto px-4">
        <p className="mb-4 text-gray-600 dark:text-gray-300 animate-fade-in">
          {t("footer")}
        </p>
        <IconLinks>
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Star, href: "#", label: "Star" },
            { icon: Twitter, href: "#", label: "Twitter" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
          ].map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors hover-effect animate-scale"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" />
            </a>
          ))}
        </IconLinks>
        <p
          className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          © {new Date().getFullYear()} Lithium Project. {t("allRightsReserved")}
        </p>
      </div>
    </FooterWrapper>
  );
}
