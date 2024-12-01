'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

export const metadata: Metadata = {
  title: '帮助中心',
  description: '查找有关我们产品的帮助和支持',
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                我的应用
              </Link>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li><Link href="/help" className="text-gray-600 hover:text-primary">帮助中心</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-primary">联系我们</Link></li>
              </ul>
            </nav>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/help" className="text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>
                      帮助中心
                    </Link>
                    <Link href="/contact" className="text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>
                      联系我们
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">{children}</main>
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600 dark:text-gray-400">
          © 2023 我的应用. 保留所有权利.
        </div>
      </footer>
    </div>
  )
}

