import React, { useEffect, useRef, useState } from "react";
import "./about.css";
import myPic from "../../assets/my_pic.webp";
import { BRANDS } from "./brands";
import { now, stats, countries, doing, certs, skills, READABLE, GLYPHS } from "./aboutData";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// true once the element has been on screen (stays true)
const useSeen = (ref, threshold = 0.12) => {
  const [seen, setSeen] = useState(reducedMotion);
  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, ref, threshold]);
  return seen;
};

const Brand = ({ slug, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style}>
    <path d={BRANDS[slug].d} />
  </svg>
);

const Glyph = ({ name }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: GLYPHS[name].replace(/<(path|circle|ellipse)/g, '<$1 pathLength="1"') }}
  />
);

const Icon = ({ id }) => (id.startsWith("g:") ? <Glyph name={id.slice(2)} /> : <Brand slug={id} />);
const colorFor = (id, override) => override || READABLE[id] || (BRANDS[id] ? `#${BRANDS[id].hex}` : "#ededed");

const Arrow = () => (
  <svg className="ab-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

// a bento tile: reveals once on screen, with a spotlight that follows the pointer
const Tile = ({ className, order, style, children, ...rest }) => {
  const ref = useRef(null);
  const spot = useRef(null);
  const seen = useSeen(ref);
  const onPointerMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    spot.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
  };
  return (
    <div
      ref={ref}
      className={`ab-tile ${className}${seen ? " in" : ""}`}
      style={{ "--d": `${(order % 4) * 70}ms`, ...style }}
      onPointerMove={onPointerMove}
      {...rest}
    >
      <span ref={spot} className="ab-spot" />
      {children}
    </div>
  );
};

const CountUp = ({ value, decimals }) => {
  const ref = useRef(null);
  const seen = useSeen(ref, 0.6);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reducedMotion()) { setShown(value); return; }
    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1100);
      setShown(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref} className="ab-n">{shown.toFixed(decimals)}</span>;
};

const Title = () => {
  const ref = useRef(null);
  const seen = useSeen(ref, 0.4);
  return (
    <h2 ref={ref} id="about-title" className={seen ? "in" : ""}>
      <span className="ab-wm"><span className="ab-wd">About</span></span>
      {/* the space is still copied, but its line-tall selection box stays invisible */}
      <span className="ab-gap"> </span>
      <span className="ab-wm">
        <span className="ab-wd ab-ul">
          Me
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M3 13 C 30 5, 60 4, 97 9" />
          </svg>
        </span>
      </span>
    </h2>
  );
};

const PhotoTile = () => {
  const photo = useRef(null);
  const tilt = (e) => {
    if (!window.matchMedia("(hover: hover)").matches || reducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photo.current.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  };
  return (
    <Tile className="ab-t-photo" order={0} onMouseMove={tilt} onMouseLeave={() => (photo.current.style.transform = "")}>
      <div ref={photo} className="ab-photo">
        <span className="ab-frame">
          <img src={myPic} alt="Iker Rosales" loading="lazy" decoding="async" />
        </span>
      </div>
      <div>
        <div className="ab-name">Iker Rosales Saiz</div>
        <div className="ab-loc">Madrid, Spain<br />Spanish · English (C1)</div>
      </div>
    </Tile>
  );
};

const About = () => (
  <section id="about" className="ab" aria-labelledby="about-title">
    <div className="ab-inner">
      <Title />
      <div className="ab-bento">
        <PhotoTile />

        <Tile className="ab-t-intro" order={1}>
          <span className="ab-k">Hi there</span>
          <p>
            I build <span className="ab-hl">AI that is useful, clear and actually works</span>, and I like
            explaining it to the people who will use it. Data Science &amp; Telecom engineer from UC3M, with
            exchanges at NTU Singapore and the University of Sydney.
          </p>
        </Tile>

        <Tile className="ab-t-now" order={2}>
          <span className="ab-live">Right now</span>
          {now.map((n, i) => (
            <div key={n.title} className="ab-now-row ab-st" style={{ "--i": i }}>
              <span className={`ab-mark${n.img ? " img" : ""}`}>
                {n.img ? <img src={n.img} alt={n.alt} /> : <Brand slug={n.brand} style={{ color: `#${BRANDS[n.brand].hex}` }} />}
              </span>
              <div>{n.title}<small>{n.sub}</small></div>
            </div>
          ))}
        </Tile>

        <Tile className="ab-t-stats" order={3}>
          {stats.map((s, i) => (
            <div key={s.label[0]} className="ab-stat ab-st" style={{ "--i": i }}>
              <CountUp value={s.value} decimals={s.decimals} />
              <span className="ab-l">{s.label[0]}<br />{s.label[1]}</span>
            </div>
          ))}
          <div className="ab-stat ab-flags-stat ab-st" style={{ "--i": stats.length }}>
            <span className="ab-l">Studied in</span>
            <div className="ab-flags">
              {countries.map((c, i) => (
                <span key={c.name} className="ab-flag ab-st" style={{ "--i": stats.length + 1 + i }}>
                  <img src={c.flag} alt="" width="26" height="19" />{c.name}
                </span>
              ))}
            </div>
          </div>
        </Tile>

        <Tile className="ab-t-do" order={4}>
          <span className="ab-k">What I do</span>
          <ul className="ab-do">
            {doing.map((d, i) => (
              <li key={d.title} className="ab-st" style={{ "--i": i }}>
                <span className="ab-ic ab-draw"><Glyph name={d.glyph} /></span>
                <div><b>{d.title}</b><span>{d.text}</span></div>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile className="ab-t-cert" order={5}>
          <span className="ab-k">Certified &amp; recognised</span>
          {certs.map((c, i) => {
            const body = (
              <>
                <span className={`ab-badge${c.padded ? " padded" : ""}`}><img src={c.logo} alt={c.alt} /></span>
                <div>
                  <b>{c.title}{c.times && <span className="ab-times">{c.times}×</span>}</b>
                  <small>{c.sub}</small>
                </div>
              </>
            );
            return c.href ? (
              <a key={c.title} className="ab-cert ab-st is-link" style={{ "--i": i }} href={c.href} target="_blank" rel="noopener noreferrer">
                {body}<Arrow />
              </a>
            ) : (
              <div key={c.title} className="ab-cert ab-st" style={{ "--i": i }}>{body}</div>
            );
          })}
        </Tile>

        {skills.map((s, k) => (
          <Tile key={s.key} className={`ab-t-skill ab-t-${s.key}`} order={6 + k} style={{ "--c": s.color }}>
            <span className="ab-sk-mark"><Glyph name={s.glyph} /></span>
            <div className="ab-sk-head">
              <span className="ab-sk-ic ab-draw"><Glyph name={s.glyph} /></span>
              <div><h3>{s.title}</h3><small>{s.tools.length} tools</small></div>
            </div>
            <div className="ab-chips">
              {s.tools.map(([label, id, override], i) => (
                <span key={label} className="ab-chip ab-st" style={{ "--brand": colorFor(id, override), "--i": i }}>
                  <Icon id={id} />{label}
                </span>
              ))}
            </div>
          </Tile>
        ))}
      </div>
    </div>
  </section>
);

export default About;
