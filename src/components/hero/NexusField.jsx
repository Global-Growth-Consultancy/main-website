import React, { useEffect, useRef } from 'react';

// ------------------------------------------------------------------
// NexusField — a living 2D particle network on a plain <canvas>.
// Drifting nodes that connect with hairline arcs when close, plus a
// soft glow ring that follows the pointer. Reads as "data network of
// students → colleges → loans", not as a 3D toy. GPU-cheap, runs at
// 60fps, pauses when off-screen, honours reduced motion.
// ------------------------------------------------------------------

const PALETTE = ['#38bdf8', '#7dd3fc', '#fbbf24', '#a78bfa'];

const NexusField = ({ className = '', density = 'auto' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let running = true;
    let particles = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const buildParticles = () => {
      const area = width * height;
      let count = 90;
      if (density === 'auto') {
        count = area < 250000 ? 70 : area < 520000 ? 110 : 150;
      } else if (density === 'sparse') {
        count = Math.round(area / 15000);
      } else if (density === 'dense') {
        count = Math.round(area / 5200);
      }
      count = Math.max(40, Math.min(count, 190));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.8 + Math.random() * 1.7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const step = (t) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const time = t * 0.001;

      // Move particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx += Math.sin(time * 0.4 + p.twinkle) * 0.0012;
        p.vy += Math.cos(time * 0.35 + p.twinkle) * 0.0012;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Connection lines (hairline, distance-faded)
      const linkDist = width < 640 ? 92 : 128;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / linkDist) * 0.16;
            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with soft glow
      for (const p of particles) {
        const glow = 0.5 + Math.sin(time * 1.6 + p.twinkle) * 0.25;
        ctx.globalAlpha = 0.75 * glow + 0.25;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.14 * glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Pointer influence — a ring that gently links nearby nodes
      if (pointer.active) {
        const rad = 150;
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < rad) {
            const alpha = (1 - d / rad) * 0.5;
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.5})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 22 + Math.sin(time * 2.4) * 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(step);
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduceMotion) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(step);
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(canvas);

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    if (!reduceMotion) {
      rafId = requestAnimationFrame(step);
    } else {
      step(0);
      cancelAnimationFrame(rafId);
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden="true" />;
};

export default NexusField;
