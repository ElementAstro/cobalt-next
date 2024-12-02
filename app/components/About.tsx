import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "@/components/about/Header";
import Hero from "@/components/about/Hero";
import Features from "@/components/about/Features";
import BuildInstructions from "@/components/about/BuildInstructions";
import Footer from "@/components/about/Footer";
import ScrollToTop from "@/components/about/ScrollToTop";

const GlobalStyle = createGlobalStyle`
  /* 全局样式内容从 globals.css 转移到这里 */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;
    }
  }

  body {
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb));
  }

  /* ...其他全局样式... */
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: white;
  transition: colors 300ms;
  /* dark 模式样式 */
  @media (prefers-color-scheme: dark) {
    background-color: #1a202c;
  }
`;

export default function Home() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />
        <Hero />
        <Features />
        <BuildInstructions />
        <Footer />
        <ScrollToTop />
      </Container>
    </>
  );
}
