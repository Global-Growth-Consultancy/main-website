import React, { useEffect, useRef } from "react";

// ------------------------------------------------------------------
// NexusField — a living neural constellation for the hero.
//
// • Three depth layers (far / mid / near) with different size, speed
//   and brightness so the network feels 3D.
// • Nodes drift, twinkle, and subtly repel from the pointer (mouse or
//   touch) — the network reacts to you.
// • Golden "signal" pulses periodically travel between near-layer
//   nodes, like data moving across the GGC network.
// • Distance-faded hairline links that breathe with a global pulse.
// • Pauses off-screen via IntersectionObserver, honours
//   prefers-reduced-motion, capped DPR for performance.
// ------------------------------------------------------------------

const COLORS = ["56,189,248", "125,211,252", "167,139,250", "251,191,36"];
const MAX_NODES = 150;

function densityFor(width, height) {
  const area = width * height;
  if (area > 1100000) return MAX_NODES;
  if (area > 560000) return 110;
  return 70;
}

const NexusField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let pulses = [];
    let raf = 0;
    let running = false;
    let lastPulseAt = 0;
    let linkDist = 128;
    const pointer = { x: -9999, y: -9999, active: false };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDist = width < 640 ? 92 : 128;

      const count = Math.min(densityFor(width, height), MAX_NODES);
      nodes = [];
      for (let i = 0; i < count; i += 1) {
        const layer = Math.random();
        const near = layer >= 0.8;
        const r = layer < 0.45
          ? 0.9 + Math.random() * 0.9
          : layer < 0.8
            ? 1.5 + Math.random() * 1.1
            : 2.2 + Math.random() * 1.4;
        const speedBase = layer < 0.45 ? 0.14 : layer < 0.8 ? 0.24 : 0.36;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speedBase,
          vy: (Math.random() - 0.5) * speedBase,
          r,
          near,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          tw: Math.random() * Math.PI * 2,
          ts: 0.6 + Math.random() * 1.4,
          baseA: near ? 0.85 : layer < 0.45 ? 0.16 : 0.4,
        });
      }
      pulses = [];
    };

    const spawnPulse = () => {
      const candidates = nodes.filter((n) => n.near || Math.random() < 0.4);
      if (candidates.length < 2) return;
      const a = candidates[Math.floor(Math.random() * candidates.length)];
      const b = candidates[Math.floor(Math.random() * candidates.length)];
      if (a === b) return;
      pulses.push({
        x0: a.x, y0: a.y, x1: b.x, y1: b.y,
        t: 0,
        speed: 0.009 + Math.random() * 0.006,
        hue: Math.random() < 0.55 ? "251,191,36" : "125,211,252",
      });
      if (pulses.length > 6) pulses.shift();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.3;
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c},${n.baseA * 0.8})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time) => {
      ctx.clearRect(0, 0, width, height);

      const globalPulse = 0.82 + 0.18 * Math.sin(time * 0.0012);
      const radius = linkDist;

      // --- update nodes (drift + pointer repulsion) ---
      for (const n of nodes) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (pointer.active && d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / radius) * 0.4;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
        n.vx *= 0.984;
        n.vy *= 0.984;
        if (n.x < 8) n.vx += 0.09; else if (n.x > width - 8) n.vx -= 0.09;
        if (n.y < 8) n.vy += 0.09; else if (n.y > height - 8) n.vy -= 0.09;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -24) n.x = width + 24; else if (n.x > width + 24) n.x = -24;
        if (n.y < -24) n.y = height + 24; else if (n.y > height + 24) n.y = -24;
      }

      // --- links ---
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / radius) * 0.34 * globalPulse;
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // --- signal pulses travelling across the network ---
      for (let k = pulses.length - 1; k >= 0; k -= 1) {
        const p = pulses[k];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(k, 1);
          continue;
        }
        const x = p.x0 + (p.x1 - p.x0) * p.t;
        const y = p.y0 + (p.y1 - p.y0) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        const trail = ctx.createRadialGradient(x, y, 0, x, y, 15);
        trail.addColorStop(0, `rgba(${p.hue},${0.85 * fade})`);
        trail.addColorStop(1, `rgba(${p.hue},0)`);
        ctx.fillStyle = trail;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.hue},${0.95 * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- spawn a pulse periodically ---
      if (time - lastPulseAt > 1500 + Math.random() * 1300) {
        spawnPulse();
        lastPulseAt = time;
      }

      // --- nodes (twinkle + near-layer glow) ---
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(time * 0.001 * n.ts + n.tw);
        const alpha = n.baseA * tw * globalPulse;
        ctx.fillStyle = `rgba(${n.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.near) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          g.addColorStop(0, `rgba(${n.c},${alpha * 0.26})`);
          g.addColorStop(1, `rgba(${n.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- pointer halo (only while pointer is inside) ---
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 30);
        g.addColorStop(0, "rgba(251,191,36,0.4)");
        g.addColorStop(0.25, "rgba(251,191,36,0.12)");
        g.addColorStop(1, "rgba(251,191,36,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastPulseAt = performance.now();
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // --- events ---
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onPointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerup", onPointerLeave);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        build();
        if (reduced) drawStatic();
      });
      resizeObserver.observe(parent);
    } else {
      window.addEventListener("resize", () => {
        build();
        if (reduced) drawStatic();
      });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduced) drawStatic();
          else start();
        } else {
          stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    build();
    if (reduced) {
      drawStatic();
    } else {
      start();
    }

    return () => {
      stop();
      io.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerup", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default NexusField;
