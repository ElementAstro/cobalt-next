import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useMouseStore } from '@/store/useMouseStore';
import { cn } from '@/lib/utils';

type MouseFollowerProps = {
  size?: number;
  trailLength?: number;
  color?: string;
  hoverScale?: number;
  className?: string;
};

export function MouseFollower({
  size = 32,
  trailLength = 5,
  color = '#ffffff',
  hoverScale = 1.2,
  className,
}: MouseFollowerProps) {
  const { x, y, isTouching, trailPositions } = useMouseStore();
  const controls = useAnimation();
  const trailRef = useRef<HTMLDivElement[]>([]);

  // Main cursor animation
  useEffect(() => {
    controls.start({
      x: x - size / 2,
      y: y - size / 2,
      scale: isTouching ? hoverScale : 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    });
  }, [x, y, isTouching, controls, size, hoverScale]);

  // Trail effect
  useEffect(() => {
    trailPositions.forEach((position, i) => {
      const trail = trailRef.current[i];
      if (trail) {
        trail.style.transform = `translate(${position.x}px, ${position.y}px)`;
        trail.style.opacity = `${1 - i / trailLength}`;
      }
    });
  }, [trailPositions, trailLength]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={cn(
          'fixed pointer-events-none z-50 rounded-full',
          'backdrop-blur-sm border border-white/20',
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={controls}
      />

      {/* Trail effect */}
      {Array.from({ length: trailLength }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRef.current[i] = el;
          }}
          className="fixed pointer-events-none rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            opacity: 1 - i / trailLength,
            transition: 'transform 0.1s linear, opacity 0.2s ease-out',
          }}
        />
      ))}
    </>
  );
}
