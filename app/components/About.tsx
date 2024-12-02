import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "@/components/about/Header";
import Hero from "@/components/about/Hero";
import Features from "@/components/about/Features";
import BuildInstructions from "@/components/about/BuildInstructions";
import Footer from "@/components/about/Footer";
import ScrollToTop from "@/components/about/ScrollToTop";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Header />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Hero />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Features />
          </motion.div>
          <motion.div variants={itemVariants}>
            <BuildInstructions />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Footer />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ScrollToTop />
          </motion.div>
        </motion.div>
      </Container>
    </>
  );
}