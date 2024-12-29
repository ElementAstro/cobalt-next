"use client";

import Header from "@/components/about/header";
import Hero from "@/components/about/hero";
import Features from "@/components/about/features";
import BuildInstructions from "@/components/about/build-instructions";
import Footer from "@/components/about/footer";
import ScrollToTop from "@/components/about/scroll-to-top";
import ParticleBackground from "@/components/about/particle-background";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <Hero />
      <Features />
      <BuildInstructions />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
