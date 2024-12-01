'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Terminal, FileText, Play, Settings, HelpCircle, Menu, Home, User } from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Scripts', href: '/scripts', icon: FileText },
  { name: 'Terminal', href: '/terminal', icon: Terminal },
  { name: 'Jobs', href: '/jobs', icon: Play },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Script Manager</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start">
          <User className="h-5 w-5 mr-2" />
          <span>Profile</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] lg:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col border-r bg-background lg:flex">
        <SidebarContent />
      </aside>
      <div className="hidden lg:block w-[240px]" />
    </>
  )
}

