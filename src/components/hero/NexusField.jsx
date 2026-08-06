import React, { useEffect, useRef } from "react";

// ------------------------------------------------------------------
// NexusField v2 — God-tier plasma aurora canvas
//
// Visual layers (bottom → top):
//  1. Flowing aurora wave bands (additive blending)
//  2. Three-depth particle system with trailing
//  3. Organic bezier connections (breathing)
//  4. Comet signal pulses along curves
//  5. Energy ripples from near-layer nodes
//  6. Shooting stars
//  7. Magnetic pointer interaction + sparkles
//
// Perf: capped DPR, IntersectionObserver pause, reduced-motion safe.
// ------------------------------------------------------------------

const AURORA_BANDS = [
  { color: "56,189,248",  freq: 0.0018, amp: 38, yOff: 0.20, speed: 0.00032, alpha: 0.055 },
  { color: "167,139,250", freq: 0.0024, amp: 50, yOff: 0.40, speed:-0.00026, alpha: 0.045 },
  { color: "251,191,36",  freq: 0.0015, amp: 34, yOff: 0.62, speed: 0.00040, alpha: 0.035 },
  { color: "30,64,175",   freq: 0.0030, amp: 44, yOff: 0.80, speed:-0.00035, alpha: 0.050 },
  { color: "236,72,153",  freq: 0.0020, amp: 30, yOff: 0.50, speed: 0.00022, alpha: 0.028 },
];

const PARTICLE_COLORS = ["56,189,248", "125,211,252", "167,139,250", "251,191,36"];

const LAYER_CFG = {
  far:  { count: 55, rMin: 0.5, rMax: 1.1, speedBase: 0.10, aMin: 0.10, aMax: 0.20, trail: 3 },
  mid:  { count: 35, rMin: 1.3, rMax: 2.1, speedBase: 0.20, aMin: 0.28, aMax: 0.48, trail: 4 },
  near: { count: 18, rMin: 2.4, rMax: 3.6, speedBase: 0.32, aMin: 0.55, aMax: 0.85, trail: 5 },
};

const LINK_RANGE_MID  = 110;
const LINK_RANGE_NEAR = 150;

const NexusField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let pulses = [];
    let ripples = [];
    let shootingStars = [];
    let sparkles = [];
    let raf = 0;
    let running = false;
    let lastPulse = 0;
    let lastRipple = 0;
    let lastStar = 0;
    const ptr = { x: -9999, y: -9999, active: false };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- build particles ---
    const build = () => {
      const rect = parent.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scale = Math.min(W * H / 500000, 1);
      nodes = [];
      for (const [layerKey, cfg] of Object.entries(LAYER_CFG)) {
        const n = Math.max(6, Math.round(cfg.count * scale));
        for (let i = 0; i < n; i++) {
          const r = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin);
          const a = cfg.aMin + Math.random() * (cfg.aMax - cfg.aMin);
          const angle = Math.random() * Math.PI * 2;
          const sp = cfg.speedBase * (0.6 + Math.random() * 0.8);
          nodes.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: Math.cos(angle) * sp,
            vy: Math.sin(angle) * sp,
            r,
            baseA: a,
            c: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
            layer: layerKey,
            tw: Math.random() * Math.PI * 2,
            ts: 0.5 + Math.random() * 1.5,
            trail: Array.from({ length: cfg.trail }, () => ({ x: 0, y: 0 })),
            trailIdx: 0,
            trailReady: false,
          });
        }
      }
      pulses = [];
      ripples = [];
      shootingStars = [];
      sparkles = [];
    };

    // --- aurora ---
    const drawAurora = (t) => {
      const saved = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      for (const band of AURORA_BANDS) {
        const baseY = band.yOff * H;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const y = baseY
            + Math.sin(x * band.freq + t * band.speed) * band.amp
            + Math.cos(x * band.freq * 0.6 + t * band.speed * 1.3) * band.amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, baseY - band.amp * 2, 0, baseY + band.amp * 2);
        grad.addColorStop(0, `rgba(${band.color},0)`);
        grad.addColorStop(0.4, `rgba(${band.color},${band.alpha})`);
        grad.addColorStop(0.6, `rgba(${band.color},${band.alpha * 0.7})`);
        grad.addColorStop(1, `rgba(${band.color},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.globalCompositeOperation = saved;
    };

    // --- update particles ---
    const updateNodes = () => {
      const cx = W * 0.5, cy = H * 0.5;
      for (const n of nodes) {
        // vortex rotation toward center
        const dx = n.x - cx, dy = n.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const vortexStr = n.layer === "near" ? 0.0003 : n.layer === "mid" ? 0.00015 : 0.00008;
        n.vx += (-dy / dist) * vortexStr;
        n.vy += ( dx / dist) * vortexStr;

        // pointer magnetic pull
        if (ptr.active) {
          const pdx = ptr.x - n.x, pdy = ptr.y - n.y;
          const pd2 = pdx * pdx + pdy * pdy;
          if (pd2 < 19600) { // 140^2
            const pd = Math.sqrt(pd2) || 1;
            const f = (1 - pd / 140) * 0.18;
            n.vx += (pdx / pd) * f;
            n.vy += (pdy / pd) * f;
          }
        }

        // damping
        n.vx *= 0.988;
        n.vy *= 0.988;

        // bounds soft-bounce
        if (n.x < 6)      n.vx += 0.08;
        else if (n.x > W - 6) n.vx -= 0.08;
        if (n.y < 6)      n.vy += 0.08;
        else if (n.y > H - 6) n.vy -= 0.08;

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -30) n.x = W + 30;
        else if (n.x > W + 30) n.x = -30;
        if (n.y < -30) n.y = H + 30;
        else if (n.y > H + 30) n.y = -30;

        // trail
        n.trail[n.trailIdx] = { x: n.x, y: n.y };
        n.trailIdx = (n.trailIdx + 1) % n.trail.length;
        if (!n.trailReady && n.trailIdx === 0) n.trailReady = true;
      }
    };

    // --- draw trails ---
    const drawTrails = (t) => {
      for (const n of nodes) {
        if (!n.trailReady) continue;
        const len = n.trail.length;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.001 * n.ts + n.tw);
        for (let i = 0; i < len; i++) {
          const idx = (n.trailIdx + i) % len;
          const pt = n.trail[idx];
          const frac = i / len;
          const alpha = n.baseA * tw * frac * 0.25;
          if (alpha < 0.01) continue;
          ctx.fillStyle = `rgba(${n.c},${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, n.r * frac * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // --- draw particles ---
    const drawNodes = (t) => {
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(t * 0.001 * n.ts + n.tw);
        const alpha = n.baseA * tw;
        ctx.fillStyle = `rgba(${n.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // near-layer glow halo
        if (n.layer === "near") {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
          g.addColorStop(0, `rgba(${n.c},${alpha * 0.22})`);
          g.addColorStop(1, `rgba(${n.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // --- bezier connections ---
    const drawConnections = (t) => {
      const pulse = 0.78 + 0.22 * Math.sin(t * 0.0014);
      const ptrBoost = ptr.active ? 1.4 : 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.layer === "far") continue;
        const range = a.layer === "near" ? LINK_RANGE_NEAR : LINK_RANGE_MID;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (b.layer === "far") continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > range * range) continue;
          const d = Math.sqrt(d2);
          let alpha = (1 - d / range) * 0.3 * pulse;

          // brighter near pointer
          if (ptr.active) {
            const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
            const pd = Math.hypot(ptr.x - mx, ptr.y - my);
            if (pd < 120) alpha *= ptrBoost;
          }

          // control point for bezier curve (perpendicular offset)
          const mx = (a.x + b.x) * 0.5, my = (a.y + b.y) * 0.5;
          const nx = -(a.y - b.y) / d, ny = (a.x - b.x) / d;
          const curvature = 12 + Math.sin(t * 0.0008 + i) * 6;
          const cx = mx + nx * curvature, cy = my + ny * curvature;

          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(cx, cy, b.x, b.y);
          ctx.stroke();
        }
      }
    };

    // --- signal pulses ---
    const spawnPulse = () => {
      const candidates = nodes.filter(n => n.layer !== "far");
      if (candidates.length < 2) return;
      const a = candidates[Math.floor(Math.random() * candidates.length)];
      let b = candidates[Math.floor(Math.random() * candidates.length)];
      let tries = 0;
      while (b === a && tries < 5) { b = candidates[Math.floor(Math.random() * candidates.length)]; tries++; }
      if (b === a) return;
      pulses.push({
        ax: a.x, ay: a.y, bx: b.x, by: b.y,
        t: 0, speed: 0.008 + Math.random() * 0.005,
        hue: Math.random() < 0.55 ? "251,191,36" : "125,211,252",
        history: [],
      });
      if (pulses.length > 5) pulses.shift();
    };

    const drawPulses = () => {
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += p.speed;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }

        // bezier path
        const dx = p.bx - p.ax, dy = p.by - p.ay;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / d, ny = dx / d;
        const mx = (p.ax + p.bx) * 0.5 + nx * 20;
        const my = (p.ay + p.by) * 0.5 + ny * 20;
        const u = p.t;
        const x = (1 - u) * (1 - u) * p.ax + 2 * (1 - u) * u * mx + u * u * p.bx;
        const y = (1 - u) * (1 - u) * p.ay + 2 * (1 - u) * u * my + u * u * p.by;

        p.history.push({ x, y });
        if (p.history.length > 7) p.history.shift();

        const fade = Math.sin(p.t * Math.PI);

        // comet trail
        for (let i = 0; i < p.history.length; i++) {
          const pt = p.history[i];
          const frac = i / p.history.length;
          const ta = fade * frac * 0.4;
          ctx.fillStyle = `rgba(${p.hue},${ta})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2 + frac * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // head glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, 16);
        g.addColorStop(0, `rgba(${p.hue},${0.8 * fade})`);
        g.addColorStop(1, `rgba(${p.hue},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${p.hue},${0.95 * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // --- energy ripples ---
    const spawnRipple = () => {
      const near = nodes.filter(n => n.layer === "near");
      if (!near.length) return;
      const src = near[Math.floor(Math.random() * near.length)];
      ripples.push({ x: src.x, y: src.y, t: 0, color: src.c, maxR: 180 });
      if (ripples.length > 2) ripples.shift();
    };

    const drawRipples = () => {
      for (let k = ripples.length - 1; k >= 0; k--) {
        const r = ripples[k];
        r.t += 0.012;
        if (r.t >= 1) { ripples.splice(k, 1); continue; }
        const radius = r.t * r.maxR;
        const alpha = (1 - r.t) * 0.35;
        ctx.strokeStyle = `rgba(${r.color},${alpha})`;
        ctx.lineWidth = 1.5 * (1 - r.t);
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    // --- shooting stars ---
    const spawnStar = () => {
      const edge = Math.floor(Math.random() * 4);
      let sx, sy, angle;
      if (edge === 0)      { sx = Math.random() * W; sy = -10; angle = Math.PI * 0.4 + Math.random() * 0.2; }
      else if (edge === 1) { sx = W + 10; sy = Math.random() * H; angle = Math.PI * 0.8 + Math.random() * 0.4; }
      else if (edge === 2) { sx = Math.random() * W; sy = H + 10; angle = -Math.PI * 0.4 + Math.random() * 0.2; }
      else                 { sx = -10; sy = Math.random() * H; angle = -Math.PI * 0.1 + Math.random() * 0.2; }
      const speed = 4 + Math.random() * 3;
      shootingStars.push({
        x: sx, y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0, maxLife: 90 + Math.random() * 40,
        trail: [],
      });
      if (shootingStars.length > 2) shootingStars.shift();
    };

    const drawStars = () => {
      for (let k = shootingStars.length - 1; k >= 0; k--) {
        const s = shootingStars[k];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 14) s.trail.shift();
        if (s.life >= s.maxLife) { shootingStars.splice(k, 1); continue; }

        const lifeFrac = 1 - s.life / s.maxLife;
        for (let i = 0; i < s.trail.length; i++) {
          const pt = s.trail[i];
          const frac = i / s.trail.length;
          const a = frac * lifeFrac * 0.7;
          ctx.fillStyle = `rgba(255,248,230,${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 0.6 + frac * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        // head
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        g.addColorStop(0, `rgba(255,248,230,${0.9 * lifeFrac})`);
        g.addColorStop(1, `rgba(251,191,36,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // --- pointer sparkles ---
    const updateSparkles = () => {
      if (ptr.active) {
        const near = nodes.filter(n => n.layer === "near");
        for (const n of near) {
          const d = Math.hypot(n.x - ptr.x, n.y - ptr.y);
          if (d < 60 && Math.random() < 0.35) {
            sparkles.push({
              x: n.x + (Math.random() - 0.5) * 12,
              y: n.y + (Math.random() - 0.5) * 12,
              life: 0, maxLife: 18 + Math.random() * 12,
              r: 0.8 + Math.random() * 1.2,
              c: n.c,
            });
          }
        }
        if (sparkles.length > 40) sparkles.splice(0, sparkles.length - 40);
      }
      for (let k = sparkles.length - 1; k >= 0; k--) {
        const s = sparkles[k];
        s.life++;
        if (s.life >= s.maxLife) { sparkles.splice(k, 1); continue; }
        const a = (1 - s.life / s.maxLife) * 0.8;
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y - s.life * 0.4, s.r * (1 - s.life / s.maxLife), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // --- pointer halo ---
    const drawPointer = () => {
      if (!ptr.active) return;
      const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 36);
      g.addColorStop(0, "rgba(251,191,36,0.35)");
      g.addColorStop(0.3, "rgba(251,191,36,0.10)");
      g.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ptr.x, ptr.y, 36, 0, Math.PI * 2);
      ctx.fill();
    };

    // --- static fallback ---
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.layer === "far") continue;
        const range = a.layer === "near" ? LINK_RANGE_NEAR : LINK_RANGE_MID;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (b.layer === "far") continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < range * range) {
            const alpha = (1 - Math.sqrt(d2) / range) * 0.25;
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c},${n.baseA * 0.7})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // --- main loop ---
    const step = (t) => {
      ctx.clearRect(0, 0, W, H);

      drawAurora(t);
      updateNodes(t);
      drawTrails(t);
      drawConnections(t);
      drawPulses();
      drawRipples();
      drawStars();
      drawNodes(t);
      updateSparkles();
      drawPointer();

      // spawn events
      if (t - lastPulse > 1800 + Math.random() * 800)  { spawnPulse();  lastPulse  = t; }
      if (t - lastRipple > 3500 + Math.random() * 1500) { spawnRipple(); lastRipple = t; }
      if (t - lastStar > 4500 + Math.random() * 2000)   { spawnStar();   lastStar   = t; }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      const now = performance.now();
      lastPulse = now; lastRipple = now; lastStar = now;
      raf = requestAnimationFrame(step);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // --- events ---
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.active = true;
    };
    const onLeave = () => { ptr.active = false; ptr.x = -9999; ptr.y = -9999; };
    const onDown = (e) => { onMove(e); };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onLeave);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => { build(); if (reduced) drawStatic(); });
      ro.observe(parent);
    } else {
      window.addEventListener("resize", () => { build(); if (reduced) drawStatic(); });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { if (reduced) drawStatic(); else start(); }
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    build();
    if (reduced) drawStatic(); else start();

    return () => {
      stop();
      io.disconnect();
      if (ro) ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerup", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default NexusField;
