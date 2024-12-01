import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { TopNav } from './components/top-nav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
          <div className="relative flex min-h-screen flex-col">
            <TopNav />
            <main className="flex-1">
              <div className="container mx-auto py-6">
                {children}
              </div>
            </main>
          </div>
      </body>
    </html>
  )
}

