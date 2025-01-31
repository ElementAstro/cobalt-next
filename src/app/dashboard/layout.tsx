import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cobalt Dashboard",
  description:
    "An advanced astronomy camera interface with draggable device windows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-screen">
      <body className={`${inter.className} overflow-hidden h-screen`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
