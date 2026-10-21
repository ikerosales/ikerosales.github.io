// The hero's living background, drawn on one canvas:
//   - a dot grid with the same pitch, size, colour and phase as About's, so the seam between them disappears;
//     a soft wave of light crosses it, the pointer acts as a lens and taps send ripples
//   - the three career lines from the timeline (education, career, community) drawn as a metro map,
//     with stations from UC3M to Salesforce · UPM and small trains running along them
// Everything pauses while the hero is off screen or the tab is hidden.

const ACC = "#ffee10", EDU = "#58c7ff", COM = "#ff8a4c", LIVE = "#00d36b";
const MONO = '500 10px "JetBrains Mono", ui-monospace, monospace';
const PITCH = 22;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

const glowCache = {};
const glow = (hex) => {
  if (glowCache[hex]) return glowCache[hex];
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, rgba(hex, 0.65));
  gr.addColorStop(0.35, rgba(hex, 0.18));
  gr.addColorStop(1, rgba(hex, 0));
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return (glowCache[hex] = c);
};

// parallel copy of a polyline at distance o (mitred corners)
function offsetLine(pts, o) {
  const nrm = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  return pts.map((p, i) => {
    const n1 = i > 0 ? nrm(pts[i - 1], p) : null, n2 = i < pts.length - 1 ? nrm(p, pts[i + 1]) : null;
    if (!n1) return [p[0] + n2[0] * o, p[1] + n2[1] * o];
    if (!n2) return [p[0] + n1[0] * o, p[1] + n1[1] * o];
    let mx = n1[0] + n2[0], my = n1[1] + n2[1];
    const ml = Math.hypot(mx, my) || 1;
    mx /= ml; my /= ml;
    const k = o / (mx * n1[0] + my * n1[1]);
    return [p[0] + mx * k, p[1] + my * k];
  });
}

// rounded corners, sampled, with cumulative length for walking along the line
function smooth(pts, r) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy), rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr, ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr, by = cy + ((ny - cy) / l2) * rr;
    for (let k = 0; k <= 10; k++) {
      const s = k / 10, m = 1 - s;
      out.push([m * m * ax + 2 * m * s * cx + s * s * bx, m * m * ay + 2 * m * s * cy + s * s * by]);
    }
  }
  out.push(pts[pts.length - 1]);
  const cum = [0];
  for (let i = 1; i < out.length; i++) cum.push(cum[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { pts: out, cum, len: cum[cum.length - 1] };
}

function pointAt(l, s) {
  const { pts, cum } = l;
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m; }
  const k = (s - cum[lo]) / (cum[hi] - cum[lo] || 1);
  return {
    x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * k,
    y: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * k,
    a: Math.atan2(pts[hi][1] - pts[lo][1], pts[hi][0] - pts[lo][0]),
  };
}

// route and stations per width: phones under the text, tablets along the top, laptops along the top and down the right margin
function layoutMetro(W, H) {
  const mob = W < 600, wide = W >= 1100, gap = mob ? 9 : 12;
  let route, names, at;
  if (mob) {
    route = [[-0.1, 0.8], [0.14, 0.8], [0.24, 0.87], [0.6, 0.87], [0.7, 0.8], [1.1, 0.8]];
    names = ["UC3M", "NTU", "AWS · USYD", "Salesforce · UPM"];
    at = [0.1, 0.36, 0.6, 0.8];
  } else if (wide) {
    route = [[-0.05, 0.14], [0.86, 0.14], [0.94, 0.31], [0.94, 0.7], [1.06, 0.86]];
    names = ["UC3M", "NTU", "IMDEA · AWS", "USYD", "Salesforce · UPM"];
    at = [0.06, 0.185, 0.31, 0.437, 0.84]; // top labels stay clear of the nav links
  } else {
    route = [[-0.05, 0.12], [0.36, 0.12], [0.44, 0.19], [1.05, 0.19]];
    names = ["UC3M", "NTU", "IMDEA · AWS", "USYD", "Salesforce · UPM"];
    at = [0.07, 0.25, 0.47, 0.67, 0.86];
  }
  const pts = route.map(([u, v]) => [u * W, v * H]);
  const lines = [[EDU, -gap], [ACC, 0], [COM, gap]].map(([c, o], i) => ({
    c, ...smooth(offsetLine(pts, o), mob ? 16 : 26), speed: 60 + i * 16, phase: i * 0.37,
  }));
  const mid = lines[1];
  const stations = at.map((f, i) => ({ name: names[i], now: i === at.length - 1, ...pointAt(mid, f * mid.len) }));
  return { lines, stations, gap, mob };
}

export function createHeroField(canvas, host, { reduce = false, origin } = {}) {
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dots = [], metro = null;
  let raf = 0, last = 0, clock = 0, visible = true;
  let ripples = [], nextRipple = 0.8;
  const P = { x: -9999, y: -9999, sx: -9999, sy: -9999, amt: 0, on: false };
  // entrance timestamps on the same clock as the loop
  const intro = { grid: 0, metro: 0.5 };

  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // About's dots sit at (1,1) of every 22px cell from its own top-left, and the hero's bottom edge is About's top
    dots = [];
    for (let y = H + 1 - PITCH; y > -PITCH; y -= PITCH) for (let x = 1; x < W + PITCH; x += PITCH) dots.push(x, y);
    metro = layoutMetro(W, H);
    if (reduce) paint(6);
  }

  function drawGrid(t) {
    if (!reduce && t > nextRipple) {
      ripples.push({ x: Math.random() * W, y: H * (0.12 + Math.random() * 0.55), t0: t });
      nextRipple = t + 2.6 + Math.random() * 1.8;
    }
    ripples = ripples.filter((r) => t - r.t0 < 2.6);
    const B = 10, lit = Array.from({ length: B }, () => new Path2D());
    const base = [new Path2D(), new Path2D(), new Path2D()];
    const quiet = H * 0.7;
    for (let i = 0; i < dots.length; i += 2) {
      const x = dots[i], y = dots[i + 1];
      // life fades out over the last 30% so the bottom rows are identical to About's
      const f = y < quiet ? 1 : Math.max(0, 1 - (y - quiet) / (H - 12 - quiet));
      const fade = f * f * (3 - 2 * f);
      const w = 0.5 + 0.5 * Math.sin(x * 0.0085 + y * 0.0055 - t * 0.85);
      let e = Math.pow(w, 6) * 0.22;
      const dx = x - P.sx, dy = y - P.sy, dist = Math.hypot(dx, dy) || 1;
      const lens = P.amt * Math.max(0, 1 - dist / 150);
      let push = lens * 6;
      for (const r of ripples) {
        const age = t - r.t0;
        if (age < 0) continue;
        const rd = Math.hypot(x - r.x, y - r.y);
        const band = Math.exp(-((rd - age * 240) ** 2) / 500) * (1 - age / 2.6);
        e += band * 0.55;
        push += band * 3;
      }
      e = Math.min(1, e + lens * 0.7) * fade;
      push *= fade;
      if (e < 0.05) {
        const b = y < H * 0.45 ? 0 : y < quiet ? 1 : 2;
        base[b].moveTo(x + 1.15, y);
        base[b].arc(x, y, 1.15, 0, 6.2832);
        continue;
      }
      const k = Math.min(B - 1, Math.floor(e * B)), r = 1.15 + e * 1.4;
      const px = x + (dx / dist) * push, py = y + (dy / dist) * push;
      lit[k].moveTo(px + r, py);
      lit[k].arc(px, py, r, 0, 6.2832);
    }
    ctx.globalAlpha = reduce ? 1 : clamp01((t - intro.grid) / 0.9);
    ["#222", "#1d1d1d", "#191919"].forEach((c, i) => { ctx.fillStyle = c; ctx.fill(base[i]); });
    // a soft, slightly warm yellow so the field supports the text instead of competing with it
    for (let k = 0; k < B; k++) {
      const e = (k + 0.5) / B;
      ctx.fillStyle = `rgba(${Math.round(230 + 10 * e)},${Math.round(225 - 5 * e)},${Math.round(120 - 80 * e)},${(0.08 + e * 0.5).toFixed(3)})`;
      ctx.fill(lit[k]);
    }
    ctx.globalAlpha = 1;
  }

  function drawMetro(t) {
    const { lines, stations, gap, mob } = metro;
    const el = reduce ? 99 : t - intro.metro;
    if (el <= 0) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    lines.forEach((l, i) => {
      const p = clamp01((el - i * 0.18) / 2.2);
      if (!p) return;
      const upto = l.len * (1 - Math.pow(1 - p, 3));
      ctx.beginPath();
      for (let k = 0; k < l.pts.length && l.cum[k] <= upto; k++) ctx.lineTo(l.pts[k][0], l.pts[k][1]);
      const tip = pointAt(l, upto);
      ctx.lineTo(tip.x, tip.y);
      // lines dissolve before About's top edge
      const g = ctx.createLinearGradient(0, H * 0.84, 0, H);
      g.addColorStop(0, rgba(l.c, 0.42));
      g.addColorStop(1, rgba(l.c, 0));
      ctx.lineWidth = mob ? 3 : 4;
      ctx.strokeStyle = g;
      ctx.stroke();
      if (p < 1) { ctx.drawImage(glow(l.c), tip.x - 14, tip.y - 14, 28, 28); return; }
      for (let n = 0; n < 3; n++) {
        const q = pointAt(l, (t * l.speed + l.len * (l.phase + n / 3)) % l.len);
        if (q.y > H * 0.9) continue;
        ctx.drawImage(glow(l.c), q.x - 14, q.y - 14, 28, 28);
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(q.a);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-8, -2.5, 16, 5, 2.5); else ctx.rect(-8, -2.5, 16, 5);
        ctx.fillStyle = l.c;
        ctx.fill();
        ctx.restore();
      }
    });
    ctx.font = MONO;
    stations.forEach((s, i) => {
      const a = clamp01((el - 1.2 - i * 0.1) / 0.5);
      if (!a) return;
      ctx.globalAlpha = a;
      const h = gap * 2 + (mob ? 10 : 12), w = mob ? 10 : 12, pop = 0.85 + 0.15 * (1 - Math.pow(1 - a, 3));
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.a);
      ctx.scale(pop, pop);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, w / 2); else ctx.rect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = s.now ? LIVE : "rgba(237,237,237,.75)";
      ctx.stroke();
      ctx.restore();
      if (s.now) {
        const ph = (t * 0.8) % 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8 + ph * 18, 0, 7);
        ctx.strokeStyle = rgba(LIVE, (1 - ph) * 0.5);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.fillStyle = s.now ? "rgba(0,211,107,.85)" : "rgba(237,237,237,.5)";
      if (Math.abs(Math.sin(s.a)) > 0.7) {
        ctx.textAlign = "right";
        ctx.fillText(s.name, s.x - h / 2 - 8, s.y + 3.5);
      } else {
        // keep every label inside the screen, however narrow
        const tw = ctx.measureText(s.name).width, x = Math.min(W - 8 - tw / 2, Math.max(8 + tw / 2, s.x));
        ctx.textAlign = "center";
        ctx.fillText(s.name, x, s.y - h / 2 - 9);
      }
      ctx.globalAlpha = 1;
    });
  }

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    drawGrid(t);
    drawMetro(t);
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    P.sx += (P.x - P.sx) * 0.14;
    P.sy += (P.y - P.sy) * 0.14;
    P.amt += ((P.on ? 1 : 0) - P.amt) * 0.08;
    paint(clock);
    raf = requestAnimationFrame(loop);
  }
  const start = () => {
    if (reduce || raf || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const onMove = (e) => {
    const [x, y] = local(e);
    if (P.sx < -999) { P.sx = x; P.sy = y; }
    P.x = x; P.y = y; P.on = true;
  };
  const onLeave = () => (P.on = false);
  const onUp = (e) => { if (e.pointerType !== "mouse") P.on = false; };
  const onDown = (e) => {
    if (e.target.closest("a, button")) return;
    const [x, y] = local(e);
    ripples.push({ x, y, t0: clock });
  };
  const onVis = () => (document.hidden ? stop() : start());

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
  io.observe(host);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointerdown", onDown);
  document.addEventListener("visibilitychange", onVis);

  resize();
  // entrance: the grid lights up with a ripple born at the name, then the lines draw themselves
  if (!reduce && origin) {
    const n = origin.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    ripples.push({ x: n.left - c.left + n.width * 0.3, y: n.top - c.top + n.height / 2, t0: 0.25 });
  }
  start();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("pointerup", onUp);
    host.removeEventListener("pointerdown", onDown);
    document.removeEventListener("visibilitychange", onVis);
  };
}
