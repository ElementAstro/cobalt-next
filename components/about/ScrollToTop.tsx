"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styled from "styled-components";

const ScrollButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: #2563eb;
  color: white;
  padding: 8px;
  border-radius: 9999px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, opacity 0.3s;
  z-index: 50;

  &:hover {
    background-color: #1d4ed8;
  }

  animation: fadeIn 0.5s ease-in;
`;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <ScrollButton onClick={scrollToTop} aria-label="Scroll to top">
          <ArrowUp size={24} />
        </ScrollButton>
      )}
    </>
  );
}
