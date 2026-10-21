import { events, MONTHS } from "./timelineData";

export const LANE_ORDER = ["education", "career", "community"];

// Absolute month index: Jan 2021 = 2021 * 12.
export const toIndex = ({ y, m }) => y * 12 + (m - 1);
export const monthLabel = (idx) => {
  const i = Math.floor(idx);
  return `${MONTHS[((i % 12) + 12) % 12]} ${Math.floor(i / 12)}`;
};
export const shortLabel = ({ y, m }) => `${MONTHS[m - 1]} ${String(y).slice(2)}`;
export const monthsText = (n) => {
  if (n < 12) return `${n} mo`;
  const yrs = Math.floor(n / 12);
  const rem = n % 12;
  return `${yrs} yr${yrs > 1 ? "s" : ""}${rem ? ` ${rem} mo` : ""}`;
};
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/*
 * Each activity rides its lane from `sx` (start month) to `ex` (first month after it ended).
 * - A role followed by another at the same institution within a month is a promotion:
 *   the first one hands over to the second on the same track (`exDraw`).
 * - Overlapping activities in a lane get parallel tracks.
 */
export function buildActivities(now = new Date()) {
  const nowIdx = now.getFullYear() * 12 + now.getMonth() + (now.getDate() - 1) / 31;

  const acts = events.map((event) => {
    const ended = !event.ongoing && !!event.end;
    const sx = toIndex(event.start);
    const ex = ended ? toIndex(event.end) + 1 : nowIdx;
    return {
      ...event,
      brand: event.brand || event.shortName,
      bandLabel: event.bandLabel || event.role,
      summary: event.summary || (typeof event.description?.[0] === "string" ? event.description[0] : ""),
      ended,
      sx,
      ex,
      exDraw: ex,
      months: ended ? ex - sx : Math.floor(nowIdx) - sx + 1,
    };
  });

  for (const a of acts) {
    for (const b of acts) {
      if (a === b || !a.ended || a.lane !== b.lane || a.institution !== b.institution) continue;
      if (b.sx >= a.ex - 1 && b.sx <= a.ex) {
        a.exDraw = b.sx;
        a.handoverTo = b.id;
        b.promotedFrom = a.id;
      }
    }
  }

  const tracks = {};
  for (const lane of LANE_ORDER) {
    const ends = [];
    acts
      .filter((a) => a.lane === lane)
      .sort((p, q) => p.sx - q.sx || q.exDraw - q.sx - (p.exDraw - p.sx))
      .forEach((a) => {
        let t = ends.findIndex((end) => end <= a.sx + 1e-6);
        if (t === -1) {
          t = ends.length;
          ends.push(0);
        }
        ends[t] = a.exDraw;
        a.track = t;
      });
    tracks[lane] = Math.max(1, ends.length);
  }

  const order = [...acts].sort(
    (p, q) => p.sx - q.sx || LANE_ORDER.indexOf(p.lane) - LANE_ORDER.indexOf(q.lane)
  );

  return { acts: order, nowIdx, tracks, origin: Math.min(...acts.map((a) => a.sx)) };
}

// The longest stretch where nothing starts or ends gets squeezed so the map stays dense.
export function findCompression(acts) {
  const marks = [...new Set(acts.flatMap((a) => (a.ended ? [a.sx, a.ex] : [a.sx])))].sort((p, q) => p - q);
  let best = null;
  for (let i = 0; i < marks.length - 1; i++) {
    const gap = marks[i + 1] - marks[i];
    if (gap > 14 && (!best || gap > best.to - best.from + 6)) {
      best = { from: marks[i] + 3, to: marks[i + 1] - 3 };
    }
  }
  return best;
}

export function makeScale({ origin, P, left, comp, squeeze = 0.1 }) {
  const a = comp ? comp.from - origin : Infinity;
  const b = comp ? comp.to - origin : Infinity;
  const X = (m) => {
    const d = m - origin;
    if (d <= a) return left + d * P;
    if (d <= b) return left + a * P + (d - a) * P * squeeze;
    return left + a * P + (b - a) * P * squeeze + (d - b) * P;
  };
  const inv = (x) => {
    const d = x - left;
    const xa = a * P;
    const xb = xa + (b - a) * P * squeeze;
    if (d <= xa) return origin + d / P;
    if (d <= xb) return origin + a + (d - xa) / (P * squeeze);
    return origin + b + (d - xb) / P;
  };
  return { X, inv };
}

// Time runs right-to-left: today sits at `off`, the past extends to the right.
export function mirrorScale(scale, nowIdx, off) {
  const ref = scale.X(nowIdx);
  return {
    X: (m) => off + (ref - scale.X(m)),
    inv: (x) => scale.inv(ref - (x - off)),
  };
}

const ROWS = {
  roomy: { top: 88, laneGap: 74, trackGap: 58, bottom: 54 },
  short: { top: 72, laneGap: 60, trackGap: 46, bottom: 40 },
};

const lerp = (a, b, t) => a + (b - a) * t;

/*
 * Phones: the map scales with the available height, from an iPhone SE (~600px of stage) up to a
 * Pro Max (~900px), so taller screens don't end up with a band of empty space under the cards.
 * The minimum gaps keep room for a date label (~12px) between rows, so a label never touches the
 * band above it.
 */
export function compactMetrics(stageH) {
  const t = clamp((stageH - 600) / 300, 0, 1);
  return {
    band: Math.round(lerp(24, 32, t)),
    badge: Math.round(lerp(28, 38, t)),
    rows: {
      top: Math.round(lerp(60, 88, t)),
      laneGap: Math.round(lerp(50, 80, t)),
      trackGap: Math.round(lerp(48, 64, t)),
      bottom: Math.round(lerp(34, 56, t)),
    },
  };
}

// `density` is a ROWS key or an explicit spacing object (from compactMetrics)
export function rowLayout(tracks, density) {
  const { top, laneGap, trackGap, bottom } = typeof density === "string" ? ROWS[density] : density;
  const rows = {};
  let y = top;
  LANE_ORDER.forEach((lane, i) => {
    rows[lane] = [];
    for (let t = 0; t < tracks[lane]; t++) {
      rows[lane].push(y);
      if (t < tracks[lane] - 1) y += trackGap;
    }
    if (i < LANE_ORDER.length - 1) y += laneGap;
  });
  return { rows, height: y + bottom };
}

// Months where activities on different tracks start or end together.
export function findJunctions(acts, rows) {
  const byMonth = new Map();
  for (const a of acts) {
    const marks = [a.sx];
    if (a.ended && !a.handoverTo) marks.push(a.ex);
    for (const m of marks) {
      if (!byMonth.has(m)) byMonth.set(m, new Set());
      byMonth.get(m).add(rows[a.lane][a.track]);
    }
  }
  return [...byMonth.entries()]
    .filter(([, ys]) => ys.size > 1)
    .map(([m, ys]) => ({ m, y1: Math.min(...ys), y2: Math.max(...ys) }));
}

export function roundedPath(points, r = 14) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0);
    const l2 = Math.hypot(x2 - x1, y2 - y1);
    if (!l1 || !l2) continue;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    d += ` L${x1 + ((x0 - x1) * rr) / l1},${y1 + ((y0 - y1) * rr) / l1}`;
    d += ` Q${x1},${y1} ${x1 + ((x2 - x1) * rr) / l2},${y1 + ((y2 - y1) * rr) / l2}`;
  }
  const last = points[points.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}
