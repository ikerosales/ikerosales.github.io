import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const ROLES = ["Solution Engineering @ Salesforce", "MSc AI @ UPM", "UC3M · USYD · NTU", "Ex-AWS"];

const linesBg = (
  <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,400 Q360,300 720,400 T1440,400" stroke="#ffee10" strokeOpacity="0.08" strokeWidth="2" fill="none" />
    <path d="M0,320 Q360,220 720,320 T1440,320" stroke="#ffee10" strokeOpacity="0.06" strokeWidth="2" fill="none" />
    <path d="M0,240 Q360,140 720,240 T1440,240" stroke="#ffee10" strokeOpacity="0.04" strokeWidth="2" fill="none" />
    <path d="M0,160 Q360,60 720,160 T1440,160" stroke="#ffee10" strokeOpacity="0.03" strokeWidth="2" fill="none" />
  </svg>
);

const Hero = () => {
  const reduce = useReducedMotion();
  const goToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="relative w-full min-h-[100svh] md:min-h-[70vh] flex flex-col justify-center items-center px-5 pt-24 pb-32 md:pt-32 md:pb-24 bg-[#111] overflow-hidden">
      {linesBg}
      <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-5xl mx-auto gap-6 md:gap-16">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="flex flex-col items-center md:items-start"
        >
          <img
            src="/head-icon.webp"
            alt="Iker Rosales head icon"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-[#ffee10] bg-[#222] shadow-lg md:mb-4"
            style={{ boxShadow: "0 0 32px 0 #ffee10aa" }}
          />
          <span className="hidden md:block text-[#ffee10] font-semibold text-sm mt-2 tracking-widest">IKER ROSALES SAIZ</span>
        </motion.div>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl font-extrabold mb-5 md:mb-4 md:leading-tight tracking-tight">
            <span className="text-white">Hi, I'm </span>
            <span className="text-[#ffee10]">Iker</span>
            <span className="text-white"> Rosales</span>
          </h1>
          {/* phones: wrapping role chips; desktop: the original single line with separators */}
          <h2 className="flex flex-wrap justify-center md:block gap-2 mb-6 md:mb-4 text-[#ffee10] font-semibold md:text-2xl md:drop-shadow">
            {ROLES.map((role, i) => (
              <React.Fragment key={role}>
                {i > 0 && <span className="hidden md:inline" aria-hidden="true"> | </span>}
                <span className="text-[13px] leading-none px-3 py-2 rounded-full border border-[#ffee10]/30 bg-[#ffee10]/[0.06] md:text-2xl md:leading-normal md:p-0 md:border-0 md:bg-transparent md:rounded-none">
                  {role}
                </span>
              </React.Fragment>
            ))}
          </h2>
          <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            I like building useful stuff around <span className="text-[#ffee10] font-semibold">AI</span>,{" "}
            <span className="text-[#ffee10] font-semibold">Cloud</span> and{" "}
            <span className="text-[#ffee10] font-semibold">Telecommunications</span>.{" "}
            <br className="hidden md:block" />
            Graduated in Data Science &amp; Telecommunications, with a background in ML research and cloud.
          </p>
        </motion.div>
      </div>

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
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
