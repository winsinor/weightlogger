'use client';

import { useEffect, useRef } from 'react';

const COLORS = [
  '#ff4455', '#ff8800', '#ffdd00', '#44ff88',
  '#44ddff', '#aa44ff', '#ff44cc', '#ffffff',
  '#ff99aa', '#88ffdd', '#ffbb44', '#66aaff',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface Shell {
  x: number;
  y: number;
  vy: number;
  color: string;
  exploded: boolean;
  trail: Array<{ x: number; y: number }>;
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const shells: Shell[] = [];
    let animId: number;
    let lastShell = 0;
    let launching = true;
    const stopLaunching = setTimeout(() => { launching = false; }, 5000);

    function launchShell() {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const apexY = canvas.height * (0.08 + Math.random() * 0.45);
      const frames = 45 + Math.random() * 20;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      shells.push({
        x,
        y: canvas.height + 10,
        vy: -(canvas.height - apexY) / frames,
        color,
        exploded: false,
        trail: [],
      });
    }

    function explode(shell: Shell) {
      const count = 90 + Math.floor(Math.random() * 50);
      const secondaryColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 1.5 + Math.random() * 5;
        particles.push({
          x: shell.x,
          y: shell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: i % 3 === 0 ? secondaryColor : shell.color,
          size: 1.5 + Math.random() * 2.5,
          decay: 0.010 + Math.random() * 0.010,
        });
      }

      // Bright white core burst
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3;
        particles.push({
          x: shell.x,
          y: shell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: '#ffffff',
          size: 1 + Math.random() * 1.5,
          decay: 0.025 + Math.random() * 0.015,
        });
      }
    }

    function tick(now: number) {
      animId = requestAnimationFrame(tick);

      // Fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Launch shells on interval while active
      const interval = 550;
      if (launching && now - lastShell > interval) {
        launchShell();
        if (Math.random() < 0.4) launchShell();
        lastShell = now;
      }

      // Once launching stops and everything has faded, clear and stop
      if (!launching && shells.length === 0 && particles.length === 0) {
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // Draw shells
      for (let i = shells.length - 1; i >= 0; i--) {
        const s = shells[i];

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 10) s.trail.shift();

        s.y += s.vy;
        s.vy += 0.12; // gravity decelerates ascent

        if (s.vy >= 0 && !s.exploded) {
          s.exploded = true;
          explode(s);
          shells.splice(i, 1);
          continue;
        }

        // Trail
        for (let t = 0; t < s.trail.length; t++) {
          ctx.globalAlpha = (t / s.trail.length) * 0.7;
          ctx.beginPath();
          ctx.arc(s.trail[t].x, s.trail[t].y, 2, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Shell head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    // Kick off with a couple shells immediately
    launchShell();
    launchShell();
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(stopLaunching);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
