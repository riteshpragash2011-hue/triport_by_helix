"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  hub: boolean;
}

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width;
      canvas!.height = height;
    }
    resize();

    const COUNT = 90;
    const GOLD = "212,175,55";
    const LINK_DIST = 180;

    function makeParticle(randomY = true): Particle {
      const hub = Math.random() < 0.15;
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.55 + 0.18),
        r: hub ? Math.random() * 2.5 + 2.5 : Math.random() * 2 + 0.8,
        opacity: hub ? Math.random() * 0.4 + 0.55 : Math.random() * 0.35 + 0.3,
        hub,
      };
    }

    const particles: Particle[] = Array.from({ length: COUNT }, () => makeParticle(true));

    let rafId: number;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.38;
            ctx.strokeStyle = `rgba(${GOLD},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        // Hub glow
        if (p.hub) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grad.addColorStop(0, `rgba(${GOLD},0.28)`);
          grad.addColorStop(1, `rgba(${GOLD},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD},${p.opacity})`;
        ctx.fill();
      }

      // Drift upward
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -12) {
          particles[i] = makeParticle(false);
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
