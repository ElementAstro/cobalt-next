import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import BuildInstructions from "./components/BuildInstructions";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <Hero />
      <Features />
      <BuildInstructions />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
