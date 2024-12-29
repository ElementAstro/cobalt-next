"use client"

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Particle, { ParticleShape, AnimationMode } from './particle';

interface ParticleBackgroundProps {
  particleCount?: number;
  color?: string;
  maxSpeed?: number;
  sizeRange?: [number, number];
  interactionDistance?: number;
  backgroundColor?: string;
  shape?: ParticleShape;
  animationMode?: AnimationMode;
  gradientColors?: [string, string];
  showConnections?: boolean;
  connectionDistance?: number;
  expandingParticleCount?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 100,
  color = '#ffffff',
  maxSpeed = 1,
  sizeRange = [1, 5],
  interactionDistance = 100,
  backgroundColor = 'black',
  shape = 'circle',
  animationMode = 'normal',
  gradientColors,
  showConnections = false,
  connectionDistance = 100,
  expandingParticleCount = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [fps, setFps] = useState(0);

  const adjustedParticleCount = useMemo(() => 
    isMobile ? Math.floor(particleCount / 2) : particleCount, 
    [isMobile, particleCount]
  );

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setIsMobile(window.innerWidth < 768);
      setParticles(Array.from({ length: adjustedParticleCount }, () => 
        new Particle(canvas, color, maxSpeed, sizeRange, shape)
      ));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustedParticleCount, color, maxSpeed, sizeRange, shape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gradientColors) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = backgroundColor;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update(canvas, mousePosition, interactionDistance, animationMode);
        particle.draw(ctx);

        // Remove expanding particles that have faded out
        if (particle.isExpanding && particle.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      // Draw connections between nearby particles
      if (showConnections) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
              ctx.globalAlpha = 1 - distance / connectionDistance;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      // Calculate FPS
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, backgroundColor, color, interactionDistance, mousePosition, animationMode, gradientColors, showConnections, connectionDistance]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (event.touches.length > 0) {
      setMousePosition({ x: event.touches[0].clientX, y: event.touches[0].clientY });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Apply click effect to nearby particles
    particles.forEach((particle) => {
      const dx = clickX - particle.x;
      const dy = clickY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        particle.applyClickEffect();
      }
    });

    // Create expanding particles
    const newParticles = Array.from({ length: expandingParticleCount }, () => 
      new Particle(canvasRef.current!, color, maxSpeed, sizeRange, shape, true, clickX, clickY)
    );
    setParticles(prevParticles => [...prevParticles, ...newParticles]);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      />
      <div className="fixed top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
        FPS: {fps}
      </div>
    </>
  );
};

export default ParticleBackground;

