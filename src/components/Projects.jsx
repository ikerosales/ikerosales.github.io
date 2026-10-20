import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiX,
} from "react-icons/fi";
import { projects } from "../constants";
import "./projects.css";

const EASE = [0.2, 0.8, 0.2, 1];
const EASE_OUT = [0.22, 1, 0.36, 1]; // easeOutQuint: fast start, long soft landing, no overshoot

const ITEMS = projects.map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, "0"),
  slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
}));

function renderDetail(item) {
  if (typeof item === "string") return item;
  return item.map((seg, i) =>
    seg.href ? (
      <a key={i} href={seg.href} target="_blank" rel="noreferrer" className="px-inline-link">
        {seg.text}
      </a>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  );
}

function Headline({ reduce }) {
  const words = [
    { w: "Things" },
    { w: "I've" },
    { w: "built.", accent: true },
  ];
  return (
    <h2 className="px-title">
      {words.map(({ w, accent }, i) => (
        <span className="px-word-mask" key={w}>
          <motion.span
            className={`px-word${accent ? " is-accent" : ""}`}
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : i * 0.08 }}
          >
            {w}
            {accent && (
              <svg className="px-underline" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M4 16 C 70 6, 150 4, 296 12"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.45 }}
                />
              </svg>
            )}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

// size "icon": compact round buttons for cards (label kept for screen readers and as a tooltip)
function ProjectLinks({ project, size = "lg" }) {
  const icon = size === "icon";
  const label = (text) => (icon ? <span className="px-sr">{text}</span> : text);
  return (
    <>
      {project.githubDisabled ? (
        <span className={`px-link is-disabled is-${size}`} title="Code not published yet">
          <FiGithub /> {label("Code soon")}
        </span>
      ) : (
        project.link && (
          <a
            className={`px-link is-${size} is-primary`}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            title={icon ? "Code on GitHub" : undefined}
          >
            <FiGithub /> {label("GitHub")}
            {!icon && <FiArrowUpRight className="px-link-arrow" />}
          </a>
        )
      )}
      {project.pdf && (
        <a
          className={`px-link is-${size}`}
          href={project.pdf}
          target="_blank"
          rel="noopener noreferrer"
          title={icon ? "Thesis PDF" : undefined}
        >
          <FiFileText /> {label("Thesis PDF")}
        </a>
      )}
      {project.live && (
        <a
          className={`px-link is-${size}`}
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          title={icon ? "Live app" : undefined}
        >
          <FiExternalLink /> {label("Live app")}
        </a>
      )}
    </>
  );
}

/*
 * Counts a stat like "194K", "~6M" or "72.5%" up from zero the first time it scrolls into view.
 * Writes straight to the DOM node: a React re-render per frame for every stat caused jank.
 */
function CountUp({ value, reduce }) {
  const parts = value.match(/^([^0-9]*)([\d.]+)(.*)$/);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  useEffect(() => {
    if (!parts || reduce || !inView || !ref.current) return undefined;
    const node = ref.current;
    const decimals = (parts[2].split(".")[1] || "").length;
    const controls = animate(0, parseFloat(parts[2]), {
      duration: 1,
      delay: 0.3,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = `${parts[1]}${v.toFixed(decimals)}${parts[3]}`;
      },
    });
    return () => controls.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span ref={ref} aria-label={value}>
      {parts && !reduce ? `${parts[1]}0${parts[3]}` : value}
    </span>
  );
}

// Card reveal, transform + opacity only (composited, no repaints): the card rises
// (staggered by column), the image fades in while settling from a slight zoom,
// then its contents cascade in reading order.
const cardVariants = (delay) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay, staggerChildren: 0.05, delayChildren: delay + 0.12 },
  },
});
const mediaVariants = {
  hidden: { opacity: 0, scale: 1.08 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_OUT } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

function ProjectCard({ project, onOpen, reduce, order }) {
  const glowRef = useRef(null);
  const frame = useRef(0);
  // the spotlight is moved with a transform once per frame instead of repainting a gradient
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <motion.article
      className={`px-card${project.category === "thesis" ? " is-featured" : ""}`}
      onPointerMove={onMove}
      variants={cardVariants((order % 3) * 0.08)}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.3, ease: EASE_OUT } }}
    >
      <span className="px-card-glow" ref={glowRef} aria-hidden="true" />

      <div className="px-media">
        <motion.div className="px-media-reveal" variants={mediaVariants}>
          {project.image ? (
            <img src={project.thumb || project.image} alt="" loading="lazy" decoding="async" />
          ) : (
            <span className="px-media-fallback">{project.accent}</span>
          )}
        </motion.div>
        <span className="px-index">{project.index}</span>
        {project.kind && <span className="px-kind">{project.kind}</span>}
      </div>

      {/* two animated groups instead of one per element: each animated node becomes a
          compositor layer during the reveal, and 40+ of them made scrolling stutter */}
      <div className="px-body">
        <motion.div className="px-text" variants={itemVariants}>
          {project.kind && <span className="px-kind-inline">{project.kind}</span>}
          <p className="px-subtitle">{project.subtitle}</p>
          <h3 className="px-name">{project.name}</h3>
          <p className="px-desc">{project.description}</p>
        </motion.div>

        <motion.div className="px-meta" variants={itemVariants}>
          {project.highlights && (
            <dl className="px-stats">
              {project.highlights.map((h) => (
                <div key={h.label}>
                  <dt>
                    <CountUp value={h.value} reduce={reduce} />
                  </dt>
                  <dd>{h.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="px-tech" aria-label="Technologies">
            {project.technologies.slice(0, 3).map((t) => (
              <li key={t}>{t}</li>
            ))}
            {project.technologies.length > 3 && <li className="is-more">+{project.technologies.length - 3}</li>}
          </ul>

          <div className="px-actions">
            <button type="button" className="px-open" onClick={(e) => onOpen(project.slug, e.currentTarget)}>
              Read more
              <span aria-hidden="true">
                <FiArrowRight />
              </span>
            </button>
            <ProjectLinks project={project} size="icon" />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, list, onClose, onNavigate, navigated, reduce }) {
  const closeRef = useRef(null);
  const pos = list.findIndex((p) => p.slug === project.slug);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
      // keep keyboard focus inside the dialog while it is open
      if (e.key === "Tab" && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll("a[href], button:not([disabled])")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate]);

  const stagger = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: EASE_OUT, delay: reduce ? 0 : 0.1 + i * 0.04 },
  });

  return (
    <motion.div
      className="px-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        ref={modalRef}
        className="px-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="px-modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18, ease: EASE } }}
        transition={{ duration: 0.38, ease: EASE_OUT }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={navigated && !reduce ? { opacity: 0, x: 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -20, transition: { duration: 0.16 } }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            {project.image && (
              <div className="px-modal-media">
                <img src={project.image} alt="" decoding="async" />
                {project.kind && <span className="px-kind">{project.kind}</span>}
              </div>
            )}

            <div className="px-modal-body">
              <motion.p className="px-subtitle" {...stagger(0)}>
                {project.index} · {project.subtitle}
              </motion.p>
              <motion.h3 id="px-modal-title" className="px-modal-name" {...stagger(1)}>
                {project.name}
              </motion.h3>
              <motion.p className="px-modal-desc" {...stagger(2)}>
                {project.description}
              </motion.p>

              {project.highlights && (
                <motion.dl className="px-stats is-lg" {...stagger(3)}>
                  {project.highlights.map((h) => (
                    <div key={h.label}>
                      <dt>{h.value}</dt>
                      <dd>{h.label}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}

              <ul className="px-details">
                {project.details.map((d, i) => (
                  <motion.li key={i} {...stagger(4 + i)}>
                    {renderDetail(d)}
                  </motion.li>
                ))}
              </ul>

              <motion.ul className="px-tech is-all" aria-label="Technologies" {...stagger(5 + project.details.length)}>
                {project.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </motion.ul>

              <motion.div className="px-modal-links" {...stagger(6 + project.details.length)}>
                <ProjectLinks project={project} size="lg" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* after the content so it always paints above the morphing image */}
        <button ref={closeRef} type="button" className="px-close" onClick={onClose} aria-label="Close project details">
          <FiX />
        </button>

        {list.length > 1 && (
          <nav className="px-modal-nav" aria-label="Other projects">
            <button type="button" onClick={() => onNavigate(-1)}>
              <FiArrowLeft /> <span>{list[(pos - 1 + list.length) % list.length].name}</span>
            </button>
            <span className="px-modal-count">
              {String(pos + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => onNavigate(1)} className="is-next">
              <span>{list[(pos + 1) % list.length].name}</span> <FiArrowRight />
            </button>
          </nav>
        )}
      </motion.div>
    </motion.div>
  );
}

const Projects = () => {
  const reduce = useReducedMotion();
  const [openSlug, setOpenSlug] = useState(null);
  const [navigated, setNavigated] = useState(false);
  const opener = useRef(null);

  // Each open project gets its own URL (#project-<slug>): it can be shared, and the
  // browser's Back button closes the detail like it would close a page.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#project-(.+)$/);
      const slug = m && ITEMS.some((p) => p.slug === m[1]) ? m[1] : null;
      setOpenSlug(slug);
      return slug;
    };
    if (fromHash()) {
      document.getElementById("projects")?.scrollIntoView();
    }
    window.addEventListener("popstate", fromHash);
    return () => window.removeEventListener("popstate", fromHash);
  }, []);

  const list = ITEMS;
  const open = ITEMS.find((p) => p.slug === openSlug);

  const onOpen = (slug, el) => {
    opener.current = el;
    setNavigated(false);
    setOpenSlug(slug);
    window.history.pushState({ project: slug }, "", `#project-${slug}`);
  };
  const onClose = () => {
    setOpenSlug(null);
    if (window.history.state?.project) window.history.back();
    else window.history.replaceState(null, "", "#projects");
    const el = opener.current;
    if (el) setTimeout(() => el.focus({ preventScroll: true }), 0);
  };
  const onNavigate = (dir) => {
    const pos = list.findIndex((p) => p.slug === openSlug);
    if (pos === -1) return;
    const next = list[(pos + dir + list.length) % list.length].slug;
    setNavigated(true);
    setOpenSlug(next);
    window.history.replaceState({ project: next }, "", `#project-${next}`);
  };

  return (
    <section id="projects" className="px">
      <div className="px-inner">
        <header className="px-head">
          <div className="px-head-text">
            <motion.div
              className="px-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="px-dot" />
              Projects · {String(ITEMS.length).padStart(2, "0")} selected
            </motion.div>
            <Headline reduce={reduce} />
            <motion.p
              className="px-lede"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            >
              Projects I can actually talk about in detail, from the repos and without dressing them up.
            </motion.p>
          </div>
        </header>

        <>
          <div className="px-grid">
            {list.map((project, i) => (
              <ProjectCard key={project.slug} project={project} order={i} onOpen={onOpen} reduce={reduce} />
            ))}
          </div>

          <AnimatePresence>
            {open && (
              <ProjectModal
                key="modal"
                project={open}
                list={list}
                onClose={onClose}
                onNavigate={onNavigate}
                navigated={navigated}
                reduce={reduce}
              />
            )}
          </AnimatePresence>
        </>
      </div>
    </section>
  );
};

export default Projects;
