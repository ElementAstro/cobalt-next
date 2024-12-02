import Header from '@/components/about/Header'
import Hero from '@/components/about/Hero'
import Features from '@/components/about/Features'
import BuildInstructions from '@/components/about/BuildInstructions'
import Footer from '@/components/about/Footer'
import ScrollToTop from '@/components/about/ScrollToTop'

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
  )
}

