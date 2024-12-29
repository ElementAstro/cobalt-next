import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error/error-boundary";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cobalt Hub",
  description:
    "Cobalt Hub is root layout for Cobalt, a modern web browser that is focused on privacy and security.",
  authors: [
    {
      name: "Max Qian",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} bg-black`}>
        <ErrorBoundary>
          <ThemeProvider>
            <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid-size animate-matrix opacity-20 pointer-events-none z-0"></div>
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
