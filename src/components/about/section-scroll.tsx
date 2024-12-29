"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ChevronUp, ChevronDown, Menu, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useDrag } from "react-use-gesture";
import { useInView } from "react-intersection-observer";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
  background?: string;
}

interface SectionScrollProps {
  sections: Section[];
  theme?: "light" | "dark";
  enableParallax?: boolean;
  animationVariant?: "fade" | "slide" | "zoom";
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function SectionScroll({
  sections,
  theme = "light",
  enableParallax = false,
  animationVariant = "fade",
  autoPlay = false,
  autoPlayInterval = 5000,
}: SectionScrollProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.5,
  });

  const setRefs = useCallback(
    (node: HTMLDivElement | null, index: number) => {
      sectionRefs.current[index] = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    if (inView && sectionRefs.current && entry?.target) {
      const observedElement = sectionRefs.current.find(
        (ref) => ref && ref.isEqualNode(entry.target)
      );
      const visibleSectionIndex = observedElement
        ? sectionRefs.current.indexOf(observedElement)
        : -1;
      if (visibleSectionIndex !== -1) {
        setActiveSection(visibleSectionIndex);
      }
    }
  }, [inView, entry]);

  const scrollToSection = useCallback(
    (index: number) => {
      sectionRefs.current[index]?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
      setIsMenuOpen(false);
    },
    [shouldReduceMotion]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToSection((activeSection + 1) % sections.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToSection(
          (activeSection - 1 + sections.length) % sections.length
        );
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToSection(sections.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, sections.length, scrollToSection]);

  const bind = useDrag(
    ({ movement: [, my], direction: [, yDir], distance }) => {
      if (distance > 50) {
        if (yDir > 0) {
          scrollToSection(
            (activeSection - 1 + sections.length) % sections.length
          );
        } else {
          scrollToSection((activeSection + 1) % sections.length);
        }
      }
    },
    { axis: "y" }
  );

  const sectionVariants = useMemo(
    () => ({
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      slide: {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 },
      },
      zoom: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 },
      },
    }),
    []
  );

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        scrollToSection((activeSection + 1) % sections.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [
    isAutoPlaying,
    activeSection,
    sections.length,
    scrollToSection,
    autoPlayInterval,
  ]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-screen overflow-hidden ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
      {...bind()}
    >
      {/* Mobile menu button */}
      <Button
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu />
      </Button>

      {/* Navigation buttons */}
      <AnimatePresence>
        {(isMenuOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40"
          >
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={activeSection === index ? "default" : "outline"}
                size="icon"
                onClick={() => scrollToSection(index)}
                aria-label={`Scroll to ${section.title}`}
              >
                {index + 1}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      <div className="h-full overflow-y-auto snap-y snap-mandatory">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            ref={(el) => setRefs(el, index)}
            className="h-screen snap-start flex flex-col items-center justify-center p-8 relative"
            style={{
              background: section.background || "transparent",
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={
              shouldReduceMotion ? {} : sectionVariants[animationVariant]
            }
            transition={{ duration: 0.5 }}
          >
            {enableParallax && !shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${section.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                animate={{
                  y: (index - activeSection) * 50,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="z-10">
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <div className="overflow-auto max-h-[calc(100vh-8rem)]">
                {section.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation and control buttons */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <Button
          onClick={() =>
            scrollToSection(
              (activeSection - 1 + sections.length) % sections.length
            )
          }
          aria-label="Previous section"
        >
          <ChevronUp />
        </Button>
        <Button
          onClick={toggleAutoPlay}
          aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          onClick={() => scrollToSection((activeSection + 1) % sections.length)}
          aria-label="Next section"
        >
          <ChevronDown />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${((activeSection + 1) / sections.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
