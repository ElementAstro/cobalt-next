import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "@/components/about/Header";
import Hero from "@/components/about/Hero";
import Features from "@/components/about/Features";
import BuildInstructions from "@/components/about/BuildInstructions";
import Footer from "@/components/about/Footer";
import ScrollToTop from "@/components/about/ScrollToTop";
import { motion } from "framer-motion";

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
    </>
  );
}
