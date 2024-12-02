"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500"
    >
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <motion.div
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between h-16">
            <motion.div variants={itemVariants} className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-primary dark:text-primary-light"
              >
                我的应用
              </Link>
            </motion.div>
            <motion.nav variants={itemVariants} className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors duration-300"
                  >
                    帮助中心
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors duration-300"
                  >
                    联系我们
                  </Link>
                </li>
              </ul>
            </motion.nav>
            <motion.div variants={itemVariants} className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-gray-800 dark:bg-gray-900"
                >
                  <SheetHeader>
                    <SheetTitle>导航菜单</SheetTitle>
                    <SheetDescription>选择一个页面进行导航。</SheetDescription>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link
                      href="/help"
                      className="text-gray-300 hover:text-primary-light transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      帮助中心
                    </Link>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-primary-light transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      联系我们
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </motion.div>
          </div>
        </motion.div>
      </header>
      <main className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-sm">
        <motion.div
          variants={itemVariants}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
        >
          © 2023 我的应用. 保留所有权利.
        </motion.div>
      </footer>
    </motion.div>
  );
}
