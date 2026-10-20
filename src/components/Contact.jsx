import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { FiArrowUp, FiArrowUpRight, FiCheck, FiCopy, FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import "./contact.css";

const EMAIL = "iker251203@gmail.com";
const EASE = [0.2, 0.8, 0.2, 1];

const LINKS = [
  {
    id: "linkedin",
    title: "LinkedIn",
    handle: "in/iker-rosales-saiz",
    note: "Experience, posts and the occasional event recap.",
    url: "https://www.linkedin.com/in/iker-rosales-saiz-49218531b/",
    icon: FiLinkedin,
    cta: "Connect",
  },
  {
    id: "github",
    title: "GitHub",
    handle: "github.com/ikerosales",
    note: "Code for the projects above, theses included.",
    url: "https://github.com/ikerosales",
    icon: FiGithub,
    cta: "Browse repos",
  },
  {
    id: "cv",
    title: "Curriculum",
    handle: "One page · PDF",
    note: "Education, experience and skills at a glance.",
    url: "/CV_Iker_Rosales_09_2026.pdf",
    icon: FiFileText,
    cta: "Open CV",
  },
];

const TOPICS = ["Let's talk", "AI", "Cloud", "Solution Engineering", "ML Research", "Telecommunications", "Agents"];

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
};

/* A band of topics that drifts on its own and speeds up / reverses with scroll velocity. */
function Marquee({ reduce }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const direction = useRef(-1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = 1;
    else if (b > 0) direction.current = -1;
    const move = direction.current * 2.2 * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(baseX.get() + move);
  });

  const items = [...TOPICS, ...TOPICS];
  return (
    <div className="cx-band" aria-hidden="true">
      <motion.div className="cx-band-track" style={{ x }}>
        {[0, 1].map((copy) => (
          <div className="cx-band-group" key={copy}>
            {items.map((t, i) => (
              <span key={`${copy}-${i}`} className={i % TOPICS.length === 0 ? "is-lead" : ""}>
                {t}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* Pulls its child toward the pointer, then springs back. */
function Magnetic({ children, strength = 0.28, enabled }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.5 });
  const onMove = (e) => {
    if (!enabled) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} className="cx-magnetic" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

function MadridClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  const hh = get("hour");
  const mm = get("minute");
  return (
    <span className="cx-clock" aria-label={`Local time in Madrid ${hh}:${mm}`}>
      {(hh + mm).split("").map((d, i) => (
        <React.Fragment key={i}>
          {i === 2 && <span className="cx-colon">:</span>}
          <span className="cx-digit">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={d}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        </React.Fragment>
      ))}
      <span className="cx-tz">{get("timeZoneName")}</span>
    </span>
  );
}

function Headline({ reduce }) {
  const lines = [
    ["Let's", "build"],
    ["something", { word: "useful.", accent: true }],
  ];
  let index = 0;
  return (
    <h2 className="cx-title">
      {lines.map((line, li) => (
        <span className="cx-line" key={li}>
          {line.map((w) => {
            const word = typeof w === "string" ? w : w.word;
            const accent = typeof w !== "string" && w.accent;
            const delay = reduce ? 0 : 0.08 * index++;
            return (
              <span className="cx-word-mask" key={word}>
                <motion.span
                  className={`cx-word${accent ? " is-accent" : ""}`}
                  initial={reduce ? false : { y: "110%", rotate: 4 }}
                  whileInView={{ y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.9, ease: EASE, delay }}
                >
                  {word}
                  {accent && (
                    <svg className="cx-underline" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                      <motion.path
                        d="M4 16 C 70 6, 150 4, 296 12"
                        initial={reduce ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.55 }}
                      />
                    </svg>
                  )}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function EmailBlock({ fine }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setCopied(true);
  };
  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <motion.div
      className="cx-email"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
    >
      <div className="cx-email-k">
        <FiMail /> Fastest way to reach me
      </div>
      <a href={`mailto:${EMAIL}`} className="cx-email-addr" ref={textRef}>
        {EMAIL.split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>
            {ch}
          </span>
        ))}
      </a>
      <div className="cx-email-actions">
        <Magnetic enabled={fine}>
          <button type="button" className={`cx-btn is-primary${copied ? " is-done" : ""}`} onClick={copy}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={copied ? "done" : "copy"}
                className="cx-btn-inner"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? "Copied to clipboard" : "Copy email"}
              </motion.span>
            </AnimatePresence>
          </button>
        </Magnetic>
        <Magnetic enabled={fine}>
          <a href={`mailto:${EMAIL}`} className="cx-btn">
            Open in mail app <FiArrowUpRight />
          </a>
        </Magnetic>
      </div>
      <span className="cx-sr" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </motion.div>
  );
}

function LinkCard({ link, i, fine, reduce }) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const Icon = link.icon;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
    if (fine && !reduce) {
      ry.set((px - 0.5) * 10);
      rx.set((0.5 - py) * 10);
    }
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  const external = link.url.startsWith("http");

  return (
    <motion.a
      ref={ref}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`cx-card is-${link.id}`}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: reduce ? 0 : 0.1 * i }}
      aria-label={`${link.title}: ${link.cta}${external ? " (opens in a new tab)" : ""}`}
    >
      <span className="cx-card-glow" aria-hidden="true" />
      <span className="cx-card-top">
        <span className="cx-card-icon">
          <Icon />
        </span>
        <span className="cx-card-arrow" aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </span>
      <span className="cx-card-title">{link.title}</span>
      <span className="cx-card-handle">{link.handle}</span>
      <span className="cx-card-note">{link.note}</span>
      <span className="cx-card-cta">
        {link.cta}
        <i aria-hidden="true" />
      </span>
    </motion.a>
  );
}

const Contact = () => {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });
  const glowY = useTransform(scrollYProgress, [0, 1], ["30%", "-10%"]);
  const linesY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <section id="contact" className="cx" ref={sectionRef}>
      <Marquee reduce={reduce} />

      <motion.div className="cx-glow" style={{ y: reduce ? 0 : glowY }} aria-hidden="true" />
      <motion.svg
        className="cx-lines"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ y: reduce ? 0 : linesY }}
        aria-hidden="true"
      >
        {[340, 280, 220].map((y, i) => (
          <motion.path
            key={y}
            d={`M0,${y} Q360,${y - 100} 720,${y} T1440,${y}`}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: EASE, delay: 0.2 * i }}
            style={{ strokeOpacity: 0.09 - i * 0.025 }}
          />
        ))}
      </motion.svg>

      <div className="cx-inner">
        <div className="cx-head">
          <motion.div
            className="cx-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="cx-dot" />
            Contact · Madrid, <MadridClock />
          </motion.div>
          <Headline reduce={reduce} />
          <motion.p
            className="cx-lede"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          >
            Happy to talk about AI, cloud and solution engineering, or anything you think I&apos;d enjoy
            building.
          </motion.p>
        </div>

        <EmailBlock fine={fine} />

        <div className="cx-cards">
          {LINKS.map((link, i) => (
            <LinkCard key={link.id} link={link} i={i} fine={fine} reduce={reduce} />
          ))}
        </div>
      </div>

      <footer className="cx-foot">
        <span>© {new Date().getFullYear()} Iker Rosales Saiz</span>
        <span className="cx-foot-mid">Designed and built with React &amp; Framer Motion</span>
        <Magnetic enabled={fine} strength={0.35}>
          <button
            type="button"
            className="cx-top"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          >
            Back to top
            <span aria-hidden="true">
              <FiArrowUp />
            </span>
          </button>
        </Magnetic>
      </footer>
    </section>
  );
};

export default Contact;
