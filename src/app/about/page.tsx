"use client";

import Header from "@/components/about/header";
import Hero from "@/components/about/hero";
import Features from "@/components/about/features";
import BuildInstructions from "@/components/about/build-instructions";
import Footer from "@/components/about/footer";
import ScrollToTop from "@/components/about/scroll-to-top";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <ScrollProgress className="top-[65px]" />
      <Hero />
      <Features />
      <BuildInstructions />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
