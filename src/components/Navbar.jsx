import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "career", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const EASE_OUT = [0.22, 1, 0.36, 1];

const Navbar = () => {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // full-screen mobile menu: lock the page behind it, close on Escape or when widening to desktop
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => mq.matches && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <motion.nav
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className={`fixed top-0 left-0 w-full z-30 transition-colors duration-300 ${
        open ? "bg-[#0b0b0b]" : scrolled ? "bg-[#111]/90 shadow-lg backdrop-blur" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <img
            src="/head-icon.webp"
            alt="Iker Rosales logo"
            className="w-9 h-9 rounded-full border-2 border-[#ffee10] bg-[#222] shadow group-hover:scale-105 transition"
          />
          <span className="text-lg font-bold text-[#ffee10] tracking-wide group-hover:text-white transition">Iker Rosales</span>
        </a>
        <ul className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative font-medium text-base transition px-2 py-1 rounded
                  ${activeSection === link.id ? "text-[#ffee10]" : "text-gray-200 hover:text-[#ffee10]"}`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ffee10]" />
                )}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="md:hidden relative flex items-center justify-center w-11 h-11 -mr-1.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffee10]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {/* three bars that fold into an X */}
          {[-7, 0, 7].map((offset, i) => (
            <motion.span
              key={i}
              className="absolute left-[10px] w-6 h-[2px] rounded-full bg-[#ffee10]"
              style={{ top: "50%", marginTop: -1 }}
              animate={
                open
                  ? { y: 0, rotate: i === 0 ? 45 : i === 2 ? -45 : 0, opacity: i === 1 ? 0 : 1 }
                  : { y: offset, rotate: 0, opacity: 1 }
              }
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="md:hidden fixed inset-0 bg-[#0b0b0b] flex flex-col px-6"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 88px)",
              paddingBottom: "max(28px, env(safe-area-inset-bottom))",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  className="border-b border-white/10"
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.05 + i * 0.06 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-4 py-5 text-[2rem] leading-none font-bold tracking-tight ${
                      activeSection === link.id ? "text-[#ffee10]" : "text-white active:text-[#ffee10]"
                    }`}
                  >
                    <span className="font-mono text-xs font-medium text-white/40 tracking-widest">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-auto flex flex-col gap-3"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">GET IN TOUCH</span>
              <a href="mailto:iker251203@gmail.com" className="text-lg font-semibold text-[#ffee10] py-1">
                iker251203@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
