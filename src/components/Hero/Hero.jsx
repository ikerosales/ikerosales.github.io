import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiFileText, FiGithub, FiLinkedin } from "react-icons/fi";
import { createHeroField } from "./heroField";
import "./hero.css";

const CV_URL = "/CV_Iker_Rosales_09_2026.pdf";
const LINKEDIN_URL = "https://www.linkedin.com/in/iker-rosales-saiz-49218531b/";
const GITHUB_URL = "https://github.com/ikerosales";

// one word that rises out of its own mask; d is its delay in seconds
const Word = ({ d, children }) => (
  <span className="hx-m">
    <span style={{ "--d": `${d}s` }}>{children}</span>
  </span>
);

// the space between two masked words: still copied, but its selection box (as tall as the line) stays invisible
const Gap = () => <span className="hx-gap"> </span>;

const Hero = () => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const [play, setPlay] = useState(false);

  // living background: dot grid + career lines (see heroField.js)
  useEffect(
    () => createHeroField(canvasRef.current, ref.current, { reduce, origin: nameRef.current }),
    [reduce]
  );

  // start the entrance on the first painted frame so the hidden state never flashes
  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // leaving: the text lifts and fades while the next section takes over
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.75], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

  const goToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section ref={ref} className={`hx${reduce ? "" : " armed"}${play ? " play" : ""}`}>
      <canvas ref={canvasRef} className="hx-bg" aria-hidden="true" />
      <div className="hx-veil" />
      <motion.div className="hx-stmt" style={reduce ? undefined : { y, opacity }}>
        <h1 className="hx-title">
          <span className="hx-hi"><Word d={0.15}>Hi,</Word><Gap /><Word d={0.23}>I'm</Word></span>
          <span ref={nameRef} className="hx-name"><Word d={0.36}><em>Iker</em></Word><Gap /><Word d={0.46}>Rosales</Word></span>
        </h1>
        <span className="hx-now hx-rise" style={{ "--d": "0.8s" }}>
          <span className="hx-dot" aria-hidden="true" />
          Now · Solution Engineering @ Salesforce · MSc AI @ UPM
        </span>
        <p className="hx-lede hx-rise" style={{ "--d": "0.95s" }}>
          I like building useful stuff around <span className="hx-hl" style={{ "--d": "1.3s" }}>AI</span>,{" "}
          <span className="hx-hl" style={{ "--d": "1.4s" }}>Cloud</span> and{" "}
          <span className="hx-hl" style={{ "--d": "1.5s" }}>Telecommunications</span>. Graduated in Data Science &amp;
          Telecommunications, with a background in ML research and cloud.
        </p>
        <div className="hx-ctas">
          <span className="hx-rise" style={{ "--d": "1.15s" }}>
            <a className="hx-btn primary" href={CV_URL} target="_blank" rel="noopener noreferrer">
              <FiFileText aria-hidden="true" />Open CV
            </a>
          </span>
          <span className="hx-rise" style={{ "--d": "1.23s" }}>
            <a className="hx-btn icon" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin aria-hidden="true" />
            </a>
          </span>
          <span className="hx-rise" style={{ "--d": "1.31s" }}>
            <a className="hx-btn icon" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub aria-hidden="true" />
            </a>
          </span>
        </div>
      </motion.div>

      {/* Scroll cue: a full-width flex row does the centring, so the animation's transform
          can never knock it off-centre (the old version lost its -translate-x-1/2 to framer). */}
      <div
        className="absolute inset-x-0 z-20 flex justify-center pointer-events-none"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <motion.button
          type="button"
          onClick={goToAbout}
          aria-label="Scroll to About"
          className="pointer-events-auto flex flex-col items-center gap-2.5 min-w-[44px] min-h-[44px] px-3 py-1 text-[#ffee10]/80 hover:text-[#ffee10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffee10] rounded-lg transition-colors"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="relative block w-[22px] h-[36px] rounded-full border-2 border-current">
            <motion.span
              className="absolute left-1/2 top-[7px] -ml-[2px] block w-[4px] h-[7px] rounded-full bg-current"
              animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </span>
          {/* trailing tracking would push the word right; matching left padding re-centres it */}
          <span className="text-[10px] font-semibold tracking-[0.3em] pl-[0.3em] leading-none">SCROLL</span>
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
