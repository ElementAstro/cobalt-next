import Header from '@/app/about/components/Header'
import Hero from '@/app/about/components/Hero'
import Features from '@/app/about/components/Features'
import BuildInstructions from '@/app/about/components/BuildInstructions'
import Footer from '@/app/about/components/Footer'
import ScrollToTop from '@/app/about/components/ScrollToTop'

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

