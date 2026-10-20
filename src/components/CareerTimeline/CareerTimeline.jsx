import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { FiArrowDown, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiX } from "react-icons/fi";
import * as TIMELINE from "./timelineData";
import {
  LANE_ORDER,
  buildActivities,
  clamp,
  findCompression,
  findJunctions,
  makeScale,
  mirrorScale,
  monthLabel,
  monthsText,
  roundedPath,
  rowLayout,
  shortLabel,
} from "./journey";
import "./careerTimeline.css";

const NAV_H = 60;
const EASE = [0.2, 0.8, 0.2, 1];

// Metrics per screen type. `start` / `mid` / `end` are where the playhead sits
// (fraction of the width) when the journey opens, while travelling, and when it arrives in 2021.
const DENSITY = {
  roomy: { P: 68, off: 240, badge: 38, band: 32, start: 0.2, mid: 0.42, end: 0.62, inset: 150 },
  short: { P: 64, off: 230, badge: 32, band: 28, start: 0.2, mid: 0.42, end: 0.62, inset: 150 },
  compact: { P: 54, off: 120, badge: 32, band: 28, start: 0.16, mid: 0.32, end: 0.56, inset: 14 },
  // phones / small windows under ~700px tall: tighter map so the cards below still fit
  compactShort: { P: 52, off: 120, badge: 28, band: 24, start: 0.16, mid: 0.32, end: 0.56, inset: 12 },
};

const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export default function CareerTimeline() {
  const { chronological, NOW } = TIMELINE;

  const activeNow = useMemo(() => {
    const nowMonths = NOW.y * 12 + NOW.m;
    return chronological.filter((event) => {
      const startM = event.start.y * 12 + event.start.m;
      const endM = event.ongoing ? Infinity : event.end.y * 12 + event.end.m;
      return startM <= nowMonths && endM > nowMonths;
    });
  }, [chronological, NOW]);

  const [opened, setOpened] = useState(null);
  const openedEvent = chronological.find((event) => event.id === opened);

  return (
    <section id="career" className="ct-root" data-screen-label="Career timeline">
      <div className="ct-inner">
        <Header activeNow={activeNow} onOpen={setOpened} />
      </div>
      <Journey onOpen={setOpened} />
      {openedEvent && <DetailModal event={openedEvent} onClose={() => setOpened(null)} />}
    </section>
  );
}

function Header({ activeNow, onOpen }) {
  return (
    <header className="ct-header">
      <div className="ct-header-text">
        <h2 className="ct-h2">Experience &amp; Education</h2>
        <p className="ct-lede">
          Three lines I&apos;ve been travelling since 2021: studies, work and the
          communities I&apos;ve been part of. It starts today; scroll to go back in time and open any stage for details.
        </p>
      </div>

      <div className="ct-now">
        <div className="ct-now-label">
          <span className="ct-now-dot" />
          {`Right now - ${activeNow.length} role${activeNow.length === 1 ? "" : "s"} in parallel`}
        </div>
        <div className="ct-now-grid">
          {activeNow.map((event) => (
            <button
              key={event.id}
              className={`ct-now-card ct-lane-${event.lane}`}
              onClick={() => onOpen(event.id)}
            >
              <div className="ct-now-card-logo">
                {event.logo ? <img src={event.logo} alt={event.institution} loading="lazy" decoding="async" /> : <span>{event.initials}</span>}
              </div>
              <div className="ct-now-card-text">
                <div className="ct-now-card-name">{event.shortName}</div>
                <div className="ct-now-card-role">{event.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function useMediaQuery(query) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatch(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return match;
}

function useWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/*
 * The journey is a pinned stage: vertical scroll drives a playhead through a
 * proportional time axis that starts today (left) and runs back to 2021 (right).
 * Each stage is a band from its end (logo) back to its start (ring); the
 * manifest below lists what was active at the playhead.
 */
function Journey({ onOpen }) {
  const reduce = useReducedMotion();
  const compact = useMediaQuery("(max-width: 720px)");
  const shortScreen = useMediaQuery("(max-height: 780px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const canDrag = finePointer && !compact;
  const tinyHeight = useMediaQuery("(max-height: 700px)");
  const density = compact ? (tinyHeight ? "compactShort" : "compact") : shortScreen ? "short" : "roomy";
  const D = DENSITY[density];

  const { acts, nowIdx, tracks, origin } = useMemo(() => buildActivities(), []);
  const comp = useMemo(() => findCompression(acts), [acts]);

  const scale = useMemo(
    () => mirrorScale(makeScale({ origin, P: D.P, left: 0, comp }), nowIdx, D.off),
    [origin, D.P, D.off, comp, nowIdx]
  );
  const { rows, height: mapH } = useMemo(() => rowLayout(tracks, density), [tracks, density]);
  const junctions = useMemo(() => findJunctions(acts, rows), [acts, rows]);

  const geo = useMemo(() => {
    const out = {};
    for (const a of acts) {
      out[a.id] = { left: scale.X(a.exDraw), right: scale.X(a.sx), y: rows[a.lane][a.track] };
    }
    // where the next (older) stage on the same track begins: a label may only spill into free space
    for (const a of acts) {
      const older = acts
        .filter((b) => b !== a && b.lane === a.lane && b.track === a.track && b.exDraw <= a.sx)
        .sort((p, q) => q.exDraw - p.exDraw)[0];
      out[a.id].nextLeft = older ? out[older.id].left : Infinity;
    }
    return out;
  }, [acts, scale, rows]);

  const startX = scale.X(nowIdx);
  const endX = scale.X(origin - 1.2);
  const travel = endX - startX;
  const layerW = endX + 220;
  const distance = Math.round(travel * (compact ? 1.2 : 1.05));

  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const viewRef = useRef(null);
  const layerRef = useRef(null);
  const pillRef = useRef(null);
  const headRef = useRef(null);
  const cursorRef = useRef(null);
  const hintRef = useRef(null);
  const skipRef = useRef(null);
  const nodes = useRef({});
  const juncRefs = useRef([]);
  const viewW = useWidth(viewRef);

  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 110, damping: 24, mass: 0.6, restDelta: 0.00005 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return null;
    return {
      top: track.getBoundingClientRect().top,
      range: Math.max(1, track.offsetHeight - stage.offsetHeight),
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const m = measure();
      if (m) progress.set(clamp((NAV_H - m.top) / m.range, 0, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure, progress, distance]);

  // "instant" (not "auto"): the site sets `scroll-behavior: smooth` globally, which would
  // turn every drag step into its own competing smooth-scroll animation.
  const jumpTo = useCallback(
    (p, behavior = "smooth") => {
      const m = measure();
      if (!m) return;
      const top = window.scrollY + m.top - NAV_H + clamp(p, 0, 1) * m.range;
      window.scrollTo({ top, behavior: reduce || behavior !== "smooth" ? "instant" : "smooth" });
    },
    [measure, reduce]
  );

  // Pill drag state: "drag" pins the playhead to the pointer, "settle" eases it back to its resting spot.
  const drag = useRef({ mode: "idle", hx: 0, fromHx: 0, t: 0 });
  const fracOf = useCallback((month) => clamp((scale.X(month) - startX) / travel, 0, 1), [scale, startX, travel]);

  const [month, setMonth] = useState(() => Math.floor(nowIdx));
  const monthRef = useRef(undefined);
  const pillText = useRef("");

  const apply = useCallback(
    (v) => {
      const layer = layerRef.current;
      if (!layer || !viewW) return;
      const cur = startX + v * travel;
      // the playhead opens near the left edge, settles mid-screen, and glides right on arrival
      const frac = D.start + (D.mid - D.start) * smoothstep(v / 0.18) + (D.end - D.mid) * smoothstep((v - 0.82) / 0.18);
      const d = drag.current;
      let hx = viewW * frac;
      if (d.mode === "drag") hx = d.hx;
      else if (d.mode === "settle") hx = d.fromHx + (hx - d.fromHx) * d.t;
      layer.style.transform = `translate3d(${(hx - cur).toFixed(2)}px,0,0)`;
      if (headRef.current) headRef.current.style.left = `${hx.toFixed(2)}px`;
      const m = scale.inv(cur);

      // labels of bands that begin off-screen stick to the visible left edge
      const visibleLeft = cur - hx + D.inset;
      const pad = D.badge / 2 + 10;

      for (const a of acts) {
        const n = nodes.current[a.id];
        if (!n || !n.band) continue;
        const { left, right } = geo[a.id];
        const w = right - left;
        if (n.txtW === undefined) {
          n.txtW = n.band.querySelector(".cj-band-txt").scrollWidth;
          // a too-short band may let its label run past its end only into free space,
          // never over the next stage; otherwise the label is cut with an ellipsis
          const room = geo[a.id].nextLeft - left - pad - 12;
          n.band.classList.toggle("is-short", n.txtW + pad + 12 > w && n.txtW <= room);
        }
        // the logo (with its label right after it) sticks to the visible left edge for as long as any
        // of the band is on screen; the logo wins over the label: if the label no longer fits, the
        // band's own overflow clips it rather than letting the logo slide away
        const shift = clamp(visibleLeft + 4 - (left - D.badge / 2), 0, Math.max(0, w - D.badge));
        // as the band is about to leave, its pinned logo and label fade out instead of piling up
        // against the next stage's logo
        const remaining = left + w - visibleLeft;
        const fade = shift > 0 ? clamp((remaining - D.badge * 2.2) / 30, 0, 1) : 1;
        // the label goes first: once fewer than ~80px of it would be readable it fades out,
        // so no clipped stub ("Solu") is left squeezed against the next logo
        const textFade = shift > 0 ? clamp((remaining - pad - 80) / 30, 0, 1) : 1;
        n.band.style.setProperty("--shift", `${shift.toFixed(1)}px`);
        n.band.style.setProperty("--fade", fade.toFixed(2));
        n.band.style.setProperty("--text-fade", textFade.toFixed(2));
        n.band.style.setProperty("--p", `${clamp(cur - left, 0, w).toFixed(1)}px`);
        n.band.classList.toggle("is-active", cur >= left - 0.5 && cur < right);
        n.band.classList.toggle("is-on", cur >= left - 0.5);
        if (n.start) n.start.classList.toggle("is-on", cur >= right);
        if (n.date) {
          n.date.classList.toggle("is-on", cur >= left - 0.5);
          n.date.style.transform = `translate3d(${shift.toFixed(1)}px,0,0)`;
          const room = Number(n.date.dataset.max) - shift;
          n.date.style.maxWidth = `${Math.max(0, room).toFixed(0)}px`;
          // never show a chopped date ("6 → …"): hide it once it no longer fits, and fade with the band
          n.date.style.opacity = room < 96 ? "0" : String(fade);
        }
      }
      junctions.forEach((j, i) => {
        const r = juncRefs.current[i];
        if (r) r.classList.toggle("is-on", cur >= scale.X(j.m));
      });

      const mm = Math.floor(clamp(m, origin, nowIdx));
      const label = monthLabel(mm);
      if (label !== pillText.current && pillRef.current) {
        pillText.current = label;
        pillRef.current.textContent = label;
      }
      if (cursorRef.current) cursorRef.current.style.left = `${(v * 100).toFixed(2)}%`;
      if (hintRef.current) hintRef.current.classList.toggle("is-hidden", v > 0.012);
      if (skipRef.current) skipRef.current.classList.toggle("is-hidden", v > 0.985);
      if (mm !== monthRef.current) {
        monthRef.current = mm;
        setMonth(mm);
      }
    },
    [acts, geo, junctions, scale, startX, travel, viewW, D, origin, nowIdx]
  );

  useMotionValueEvent(smooth, "change", (v) => {
    if (!reduce && drag.current.mode !== "drag") apply(v);
  });
  useMotionValueEvent(progress, "change", (v) => {
    if (reduce) apply(v);
  });
  useLayoutEffect(() => {
    nodes.current = { ...nodes.current };
    Object.values(nodes.current).forEach((n) => {
      delete n.txtW;
    });
    apply((reduce ? progress : smooth).get());
  }, [apply, reduce, progress, smooth]);

  const register = (id, key) => (el) => {
    if (!nodes.current[id]) nodes.current[id] = {};
    nodes.current[id][key] = el;
  };

  const focusStage = (a) => (e) => {
    if (e.currentTarget.matches(":focus-visible")) jumpTo(fracOf(a.exDraw - 0.5));
  };

  /*
   * Dragging the month pill: the playhead follows the pointer 1:1 over a still map,
   * the map pans by itself near the edges, and the page scroll is kept in sync so
   * releasing (or scrolling afterwards) continues from the dragged moment.
   */
  const onPillPointerDown = (e) => {
    if (!canDrag || e.button !== 0) return;
    e.preventDefault();
    const el = e.currentTarget;
    const stage = stageRef.current;
    const view = viewRef.current;
    const d = drag.current;
    if (d.anim) d.anim.stop();

    const v0 = smooth.get();
    const cur0 = startX + v0 * travel;
    const rect0 = view.getBoundingClientRect();
    const hx0 = parseFloat(headRef.current.style.left) || viewW * D.mid;
    const grab = e.clientX - rect0.left - hx0; // keep the pill where it was grabbed
    const minX = D.inset + 24;
    const maxX = viewW - 24;
    const EDGE = 80;
    let pointerX = hx0;
    let pan = 0;
    let raf = 0;

    progress.set(v0);
    smooth.jump(v0);
    d.mode = "drag";
    d.hx = hx0;
    el.setPointerCapture(e.pointerId);
    stage.classList.add("is-scrubbing");

    const update = () => {
      const px = clamp(pointerX, minX, maxX);
      let cur = cur0 + (px - hx0) + pan;
      const curMax = startX + travel;
      if (cur < startX || cur > curMax) {
        cur = clamp(cur, startX, curMax);
        pan = cur - cur0 - (px - hx0);
      }
      d.hx = px;
      const v = (cur - startX) / travel;
      jumpTo(v, "instant");
      progress.set(v);
      smooth.jump(v);
      apply(v);
    };
    // near either edge the map keeps travelling, faster the closer the pointer is
    const tick = () => {
      const px = clamp(pointerX, minX, maxX);
      const push = px > maxX - EDGE ? (px - (maxX - EDGE)) / EDGE : px < minX + EDGE ? -((minX + EDGE) - px) / EDGE : 0;
      if (push) {
        pan += push * 14;
        update();
      }
      raf = requestAnimationFrame(tick);
    };
    const move = (ev) => {
      pointerX = ev.clientX - view.getBoundingClientRect().left - grab;
      update();
    };
    const up = () => {
      cancelAnimationFrame(raf);
      stage.classList.remove("is-scrubbing");
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      d.mode = "settle";
      d.fromHx = d.hx;
      d.t = 0;
      d.anim = animate(0, 1, {
        duration: reduce ? 0 : 0.55,
        ease: EASE,
        onUpdate: (t) => {
          d.t = t;
          apply(smooth.get());
        },
        onComplete: () => {
          d.mode = "idle";
          apply(smooth.get());
        },
      });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(tick);
  };
  const onPillKeyDown = (e) => {
    const step = e.shiftKey ? 0.12 : 0.03;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      jumpTo(progress.get() + step);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      jumpTo(progress.get() - step);
    }
  };

  const skipToProjects = () => {
    const target = document.getElementById("projects");
    if (!target) return;
    const top = window.scrollY + target.getBoundingClientRect().top - NAV_H;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div
      className={`cj is-${density}`}
      ref={trackRef}
      style={{ "--cj-distance": `${distance}px`, "--cj-badge": `${D.badge}px`, "--cj-band": `${D.band}px` }}
    >
      <div className="cj-stage" ref={stageRef}>
        <TopBar
          acts={acts}
          origin={origin}
          nowIdx={nowIdx}
          comp={comp}
          fracOf={fracOf}
          jumpTo={jumpTo}
          cursorRef={cursorRef}
          onSkip={skipToProjects}
        />

        <div className="cj-view" ref={viewRef} style={{ height: mapH }}>
          <div className="cj-layer" ref={layerRef} style={{ width: layerW, height: mapH }}>
            <MapSvg
              acts={acts}
              geo={geo}
              rows={rows}
              scale={scale}
              origin={origin}
              nowIdx={nowIdx}
              comp={comp}
              width={layerW}
              height={mapH}
              badge={D.badge}
              junctions={junctions}
              juncRefs={juncRefs}
            />
            {acts.map((a) => {
              const { left, right, y } = geo[a.id];
              const older = acts
                .filter((b) => b.lane === a.lane && b.track === a.track && b.exDraw <= a.sx && b !== a)
                .sort((p, q) => q.exDraw - p.exDraw)[0];
              const dateLeft = left + D.badge / 2 + 6;
              const dateMax = (older ? geo[older.id].left - D.badge / 2 - 12 : left + 420) - dateLeft;
              const abroad = a.country && a.country !== "es" ? ` · ${a.country.toUpperCase()}` : "";
              const period = `${shortLabel(a.start)} → ${a.ended ? shortLabel(a.end) : "Now"}`;
              return (
                <React.Fragment key={a.id}>
                  <button
                    type="button"
                    ref={register(a.id, "band")}
                    className={`cj-band ct-lane-${a.lane}${a.ended ? "" : " is-ongoing"}`}
                    style={{ left, top: y - D.band / 2, width: right - left }}
                    onClick={() => onOpen(a.id)}
                    onFocus={focusStage(a)}
                    aria-label={`${a.role} at ${a.institution}, ${period.replace("→", "to")}. Open details`}
                  >
                    <span className="cj-band-base" aria-hidden="true">
                      <BandText a={a} />
                    </span>
                    <span className="cj-band-fill" aria-hidden="true">
                      <BandText a={a} />
                    </span>
                    <span className="cj-band-spark" aria-hidden="true" />
                    {/* outer: rides along the band with its label (--shift) so the logo never
                        slides off-screen; inner: the grow / colour animation */}
                    <span className="cj-badge-pos" aria-hidden="true">
                      <span className="cj-badge">
                        {a.logo ? <img src={a.logo} alt="" decoding="async" /> : <span>{a.initials}</span>}
                      </span>
                    </span>
                  </button>
                  {!a.promotedFrom && (
                    <span
                      ref={register(a.id, "start")}
                      className={`cj-start ct-lane-${a.lane}`}
                      style={{ left: right, top: y }}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    ref={register(a.id, "date")}
                    className="cj-date"
                    data-max={dateMax}
                    style={{ left: dateLeft, top: y - D.band / 2 - 18, maxWidth: Math.max(60, dateMax) }}
                    aria-hidden="true"
                  >
                    {period} · {monthsText(a.months)}
                    {abroad}
                  </div>
                  {a.promotedFrom && (
                    <div
                      className={`cj-tag ct-lane-${a.lane}`}
                      style={{ left: right, top: y + D.band / 2 + 6 }}
                      aria-hidden="true"
                    >
                      Promoted
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {!compact && (
            <div className="cj-lanes" aria-hidden="true">
              {LANE_ORDER.map((lane) => (
                <span key={lane} className={`ct-lane-${lane}`} style={{ top: rows[lane][0] }}>
                  {TIMELINE.lanes[lane].label}
                </span>
              ))}
            </div>
          )}

          <div className="cj-head" ref={headRef} style={{ left: `${D.start * 100}%`, height: mapH - 14 }}>
            <span
              className={`cj-pill${canDrag ? " is-draggable" : ""}`}
              onPointerDown={onPillPointerDown}
              onKeyDown={canDrag ? onPillKeyDown : undefined}
              role={canDrag ? "slider" : undefined}
              tabIndex={canDrag ? 0 : -1}
              aria-label={canDrag ? "Drag to move through time" : undefined}
              aria-valuetext={canDrag ? monthLabel(month) : undefined}
              aria-hidden={canDrag ? undefined : "true"}
            >
              {canDrag && <FiChevronLeft className="cj-pill-arrow" aria-hidden="true" />}
              <span ref={pillRef} />
              {canDrag && <FiChevronRight className="cj-pill-arrow" aria-hidden="true" />}
            </span>
          </div>
        </div>

        <Manifest acts={acts} month={month} onOpen={onOpen} hintRef={hintRef} />

        <button type="button" className="cj-skip" ref={skipRef} onClick={skipToProjects} aria-label="Skip to Projects">
          <span className="cj-skip-label">Skip to Projects</span>
          <span className="cj-skip-arrow" aria-hidden="true">
            <FiArrowDown />
          </span>
        </button>
      </div>
    </div>
  );
}

function BandText({ a }) {
  return (
    <span className="cj-band-txt">
      <b>{a.bandLabel}</b>
      <span> · {a.brand}</span>
    </span>
  );
}

function MapSvg({ acts, geo, rows, scale, origin, nowIdx, comp, width, height, badge, junctions, juncRefs }) {
  const { X } = scale;
  const ticks = [];
  for (let m = Math.ceil(origin); m <= Math.ceil(nowIdx) + 2; m++) {
    const jan = m % 12 === 0;
    if (comp && m > comp.from && m < comp.to && !jan) continue;
    ticks.push({ m, jan, x: X(m) });
  }
  const mid = comp ? (comp.from + comp.to) / 2 : null;
  const during = comp ? acts.filter((a) => a.sx <= mid && a.ex > mid).map((a) => a.brand) : [];
  const now = X(nowIdx);
  const past = X(origin - 1.2);
  const firstTrack = (lane) => rows[lane][0];

  return (
    <svg className="cj-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <g>
        {ticks.map(({ m, jan, x }) => (
          <line key={m} x1={x} y1={jan ? 18 : 30} x2={x} y2={36} className={jan ? "cj-tick is-year" : "cj-tick"} />
        ))}
        {/* time runs right-to-left, so a year's months sit to the left of its January tick */}
        {ticks
          .filter((t) => t.jan)
          .map(({ m, x }) => (
            <text key={`y${m}`} x={x - 6} y={28} textAnchor="end" className="cj-year">
              {Math.floor(m / 12)}
            </text>
          ))}
        <text x={X(origin) - 6} y={28} textAnchor="end" className="cj-year is-first">
          {monthLabel(origin)}
        </text>
        {comp && (
          <text x={X(mid)} y={height - 8} textAnchor="middle" className="cj-note">
            ≈ condensed{during.length ? ` · only ${during.join(", ")}` : ""}
          </text>
        )}
      </g>

      {LANE_ORDER.map((lane) => {
        const y = firstTrack(lane);
        return (
          <g key={lane} className={`ct-lane-${lane}`}>
            <line x1={now} y1={y} x2={past} y2={y} className="cj-rail" />
            <line x1={now - 190} y1={y} x2={now} y2={y} className="cj-rail-future" />
            {comp && (
              <path
                d={`M${X(mid) - 9},${y - 11} l6,22 M${X(mid) + 3},${y - 11} l6,22`}
                className="cj-break"
              />
            )}
          </g>
        );
      })}

      {acts
        .filter((a) => a.track > 0)
        .map((a) => {
          const y0 = firstTrack(a.lane);
          const { left, right, y } = geo[a.id];
          const d = y - y0;
          return (
            <path
              key={`branch-${a.id}`}
              d={roundedPath([
                [left - d - 22, y0],
                [left - 22, y],
                [right + 22, y],
                [right + d + 22, y0],
              ])}
              className="cj-rail"
            />
          );
        })}

      {junctions.map((j, i) => (
        <rect
          key={j.m}
          ref={(el) => {
            juncRefs.current[i] = el;
          }}
          x={X(j.m) - badge / 2 - 8}
          y={j.y1 - badge / 2 - 8}
          width={badge + 16}
          height={j.y2 - j.y1 + badge + 16}
          rx={(badge + 16) / 2}
          className="cj-junction"
        />
      ))}

      <line x1={now} y1={40} x2={now} y2={height - 22} className="cj-today-line" />
      <text x={now} y={height - 8} textAnchor="middle" className="cj-today-text">
        TODAY
      </text>
    </svg>
  );
}

function TopBar({ acts, origin, nowIdx, comp, fracOf, jumpTo, cursorRef, onSkip }) {
  const years = [];
  let lastFrac = -1;
  for (let m = Math.floor(nowIdx / 12) * 12; m >= origin; m -= 12) {
    const f = fracOf(m);
    if (f - lastFrac >= 0.07) {
      years.push({ m, f });
      lastFrac = f;
    }
  }

  /*
   * Mouse: press jumps there, dragging scrubs.
   * Touch: the minimap must not hijack page scrolling (touch-action: pan-y), so a vertical
   * swipe that starts on it still scrolls the page; only a clear horizontal drag scrubs, and
   * a clean tap (no movement) jumps. Scrolling past it never makes the timeline jump.
   */
  const onPointerDown = (e) => {
    const el = e.currentTarget;
    const go = (ev, behavior) => {
      const r = el.getBoundingClientRect();
      jumpTo((ev.clientX - r.left) / r.width, behavior);
    };
    const touch = e.pointerType !== "mouse";
    const x0 = e.clientX;
    const y0 = e.clientY;
    let scrubbing = !touch;
    let moved = false;
    if (!touch) {
      go(e, "smooth");
      el.setPointerCapture(e.pointerId);
    }
    const move = (ev) => {
      const dx = ev.clientX - x0;
      const dy = ev.clientY - y0;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      if (!scrubbing && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        scrubbing = true;
        el.setPointerCapture(ev.pointerId);
      }
      if (scrubbing) go(ev, "auto");
    };
    const end = (ev) => {
      if (touch && ev.type === "pointerup" && !moved) go(ev, "smooth");
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };

  const onKeyDown = (e) => {
    const cur = parseFloat(cursorRef.current?.style.left || "0") / 100;
    if (e.key === "ArrowRight") jumpTo(cur + 0.06);
    if (e.key === "ArrowLeft") jumpTo(cur - 0.06);
    if (e.key === "End") jumpTo(1);
    if (e.key === "Home") jumpTo(0);
  };

  return (
    <div className="cj-top">
      <button type="button" className="cj-today" onClick={() => jumpTo(0)}>
        <FiChevronsLeft /> Today
      </button>

      <div
        className="cj-mini"
        role="slider"
        tabIndex={0}
        aria-label="Move through the timeline, from today back to 2021"
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <div className="cj-mini-track">
          {acts.map((a) => (
            <span
              key={a.id}
              className={`cj-mini-seg ct-lane-${a.lane}`}
              style={{
                left: `${fracOf(a.exDraw) * 100}%`,
                width: `${Math.max(0.6, (fracOf(a.sx) - fracOf(a.exDraw)) * 100)}%`,
                top: `${LANE_ORDER.indexOf(a.lane) * 6}px`,
              }}
            />
          ))}
          {comp && (
            <span
              className="cj-mini-comp"
              style={{ left: `${fracOf(comp.to) * 100}%`, width: `${(fracOf(comp.from) - fracOf(comp.to)) * 100}%` }}
            />
          )}
          <span className="cj-mini-cursor" ref={cursorRef} />
        </div>
        <div className="cj-mini-years">
          {years.map(({ m, f }) => (
            <span key={m} style={{ left: `${f * 100}%` }}>
              {Math.floor(m / 12)}
            </span>
          ))}
        </div>
      </div>

      {/* phones: skip lives up here with the other navigation controls instead of floating over the cards */}
      <button type="button" className="cj-skip-top" onClick={onSkip} aria-label="Skip to Projects">
        <FiArrowDown />
      </button>

      <ul className="cj-legend">
        {LANE_ORDER.map((lane) => (
          <li key={lane} className={`ct-lane-${lane}`}>
            <i />
            {TIMELINE.lanes[lane].label}
          </li>
        ))}
        <li className="cj-key">
          <span className="cj-key-end" />
          End / now
        </li>
        <li className="cj-key">
          <span className="cj-key-start" />
          Start
        </li>
      </ul>
    </div>
  );
}

function Manifest({ acts, month, onOpen, hintRef }) {
  const mid = month + 0.5;
  const active = acts.filter((a) => a.sx <= mid && mid < a.exDraw).sort((p, q) => q.sx - p.sx);

  // most recent month with a change, so the latest start / end stays readable
  const changeMonths = acts.flatMap((a) => (a.ended && !a.handoverTo ? [a.sx, a.ex] : [a.sx]));
  const lastChange = Math.max(...changeMonths.filter((m) => m <= month));
  const changes = !Number.isFinite(lastChange)
    ? []
    : [
        ...acts
          .filter((a) => a.ended && !a.handoverTo && a.ex === lastChange)
          .map((a) => ({ key: `e-${a.id}`, kind: "end", a })),
        ...acts
          .filter((a) => a.sx === lastChange)
          .map((a) => ({ key: `s-${a.id}`, kind: a.promotedFrom ? "promo" : "start", a })),
      ];
  const verb = { start: "Started", end: "Finished", promo: "Promoted to" };

  return (
    <div className="cj-manifest">
      <div className="cj-m-head">
        <div className="cj-m-k">
          <span className="cj-live" />
          At this point
        </div>
        <div className="cj-m-month">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={month}
              initial={{ y: "80%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-80%", opacity: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              {monthLabel(month)}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="cj-m-count">{`${active.length} in parallel`}</div>
        <div className="cj-hint" ref={hintRef} aria-hidden="true">
          <FiArrowDown /> Scroll to go back in time
        </div>
        {changes.length > 0 && (
          <div className="cj-m-changes">
            <span className="cj-m-changes-k">{monthLabel(lastChange)}</span>
            <AnimatePresence initial={false} mode="popLayout">
              {changes.map(({ key, kind, a }) => (
                <motion.span
                  key={key}
                  className={`cj-change is-${kind} ct-lane-${a.lane}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <i />
                  {verb[kind]} <b>{a.role}</b> · {a.brand}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ul className="cj-m-list">
        <AnimatePresence initial={false} mode="popLayout">
          {active.map((a) => {
            const until = a.ended ? Math.min(month, a.ex - 1) : month;
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.22 } }}
                transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
              >
                <button type="button" className={`cj-chip ct-lane-${a.lane}`} onClick={() => onOpen(a.id)}>
                  <span className="cj-chip-logo">
                    {a.logo ? <img src={a.logo} alt="" loading="lazy" decoding="async" /> : <span>{a.initials}</span>}
                  </span>
                  <span className="cj-chip-text">
                    <span className="cj-chip-role">{a.role}</span>
                    <span className="cj-chip-org">
                      <b>{monthsText(until - a.sx + 1)}</b> · {a.brand} · {shortLabel(a.start)} –{" "}
                      {a.ended ? shortLabel(a.end) : "Now"}
                    </span>
                    <span className="cj-chip-sum">{a.summary}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function renderBullet(item) {
  if (typeof item === "string") return item;
  return item.map((seg, i) =>
    seg.href ? (
      <a key={i} href={seg.href} target="_blank" rel="noreferrer" className="ct-inline-link">
        {seg.text}
      </a>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}

function DetailModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const laneLabel = TIMELINE.lanes[event.lane].label;
  const LogoEl = (
    <div className="ct-modal-logo">
      {event.logo ? <img src={event.logo} alt={event.institution} loading="lazy" decoding="async" /> : <span>{event.initials}</span>}
    </div>
  );

  return (
    <div className="ct-modal-backdrop" onClick={onClose}>
      <div className={`ct-modal ct-lane-${event.lane}`} onClick={(e) => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose} aria-label="Close"><FiX size={18} /></button>
        <header className="ct-modal-head">
          {event.link
            ? <a href={event.link} target="_blank" rel="noreferrer" className="ct-modal-logo-link">{LogoEl}</a>
            : LogoEl}
          <div className="ct-modal-head-text">
            <div className={`ct-card-pill ct-lane-${event.lane}`}>{laneLabel}</div>
            <h2>
              {event.link
                ? <a href={event.link} target="_blank" rel="noreferrer" className="ct-modal-title-link">
                    {event.institution}<span className="ct-ext-icon"> ↗</span>
                  </a>
                : event.institution}
            </h2>
            <div className="ct-modal-role">{event.role}</div>
            <div className="ct-modal-meta mono">
              {TIMELINE.periodLabel(event)} - {TIMELINE.durationLabel(event)} - {event.location}, {event.countryName}
            </div>
          </div>
        </header>
        <ul className="ct-modal-body">
          {event.description.map((bullet, i) => <li key={i}>{renderBullet(bullet)}</li>)}
        </ul>
      </div>
    </div>
  );
}
