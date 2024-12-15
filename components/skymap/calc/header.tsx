"use client";

import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Ruler } from "lucide-react";

export function Header() {
  const { theme, toggleTheme, isMetric, toggleUnit } = useAstronomyStore();

  return (
    <header className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12">
          <img
            src="/placeholder.svg?height=48&width=48"
            alt="Astronomy Tool Logo"
            className="w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Focal Length & Ratio</h1>
          <p className="text-muted-foreground">
            Useful calculators and formulae.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleUnit}>
          <Ruler className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </header>
  );
}
